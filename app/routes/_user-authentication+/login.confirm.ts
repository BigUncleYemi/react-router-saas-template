import { href, redirect } from 'react-router';

import { saveUserAccountToDatabase } from '~/features/user-accounts/user-accounts-model.server';
import { retrieveUserAccountFromDatabaseByEmail } from '~/features/user-accounts/user-accounts-model.server';
import { requireUserIsAnonymous } from '~/features/user-authentication/user-authentication-helpers.server';
import { getSearchParameterFromRequest } from '~/utils/get-search-parameter-from-request.server';

import type { Route } from './+types/register.confirm';

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase, headers } = await requireUserIsAnonymous(request);

  const tokenHash = getSearchParameterFromRequest('token_hash')(request);

  const {
    data: { user },
    error,
  } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: 'email',
  });

  if (error) {
    throw error;
  }

  if (!user?.email || !user.id) {
    throw new Error('User not found');
  }

  // If the user for some reason did NOT click the link from the register route
  // and they try to sign up again, they will instead get here because Supabase
  // will already have created a user (with an unconfirmed email).
  // So we need to check if the user already exists in the database and if not,
  // we need to create a new user account.
  const userAccount = await retrieveUserAccountFromDatabaseByEmail(user.email);
  if (!userAccount) {
    await saveUserAccountToDatabase({
      email: user.email,
      supabaseUserId: user.id,
    });
  }

  return redirect(href('/organizations'), { headers });
}
