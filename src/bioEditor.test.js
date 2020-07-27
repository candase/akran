import React from "react";
import BioEditor from "./bioEditor";
import { render, fireEvent } from "@testing-library/react";
import axios from "./axios";

jest.mock("./axios");

test("BioEditor: no bio passed", () => {
    const { container } = render(<BioEditor />);
    expect(container.contains(container.querySelector("p#bioEdit"))).toBe(true);
    fireEvent.click(container.querySelector("p#bioEdit"));
    expect(container.contains(container.querySelector("textarea"))).toBe(true);
    expect(container.querySelector("button#buttonBioEdit").innerHTML).toBe(
        "Kaydet!"
    );
});

test("BioEditor: bio passed", () => {
    const { container } = render(<BioEditor bio="kitty" />);
    expect(container.querySelector("button#bioEdit").innerHTML).toBe("Düzenle");
    fireEvent.click(container.querySelector("button#bioEdit"));
    expect(container.contains(container.querySelector("textarea"))).toBe(true);
    expect(container.querySelector("button#buttonBioEdit").innerHTML).toBe(
        "Kaydet!"
    );
});
