import { describe, expect, test } from 'vitest';

import { render, screen } from '~/test/react-test-utils';

function Greeting() {
  return (
    <div>
      <h1>Hello World</h1>

      <p>Some description</p>
    </div>
  );
}

describe('Greeting component', () => {
  test('renders a greeting', () => {
    render(<Greeting />);

    expect(
      screen.getByRole('heading', { name: /hello world/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/some description/i)).toBeInTheDocument();
  });
});
