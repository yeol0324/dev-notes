import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import NotFound from "./NotFound";

it("renders paragraph", () => {
  render(<NotFound path="/abc" />);
  const paragraph = screen.getByText(/^해당 페이지/);
  expect(paragraph).toHaveTextContent("해당 페이지(/abc)를 찾을 수 없습니다.");
});
