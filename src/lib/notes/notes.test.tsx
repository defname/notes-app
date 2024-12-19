import { expect, test, describe, it, vi, afterAll } from "vitest"
import { render } from '@testing-library/react'
import { Renderer } from "."
import Text from "./plugins/TextPlugin"

test("Create Renderer object.", () => {
    expect(new Renderer()).toBeInstanceOf(Renderer)
    const renderer = new Renderer([Text])
    expect(renderer).toHaveProperty("plugins")
    expect(renderer.plugins["text"]).toBe(Text)
    
})

test("Load Text plugin", () => {
    const renderer = new Renderer([Text])
    const item = { type: "text", content: "Test" }
    expect(renderer.plugins["text"]({ item: item })).toEqual(<p>Test</p>)
    expect(renderer.plugins["text"].Inline({item: item})).toEqual(<p>Test</p>)
})

describe("Renderer", () => {
    const renderer = new Renderer()
    const item = { type: "text", content: "Test" }
    
    const consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    afterAll(() => {
        consoleMock.mockReset();
    });

    it('should warn if no suitable plugin is registered', () => {
        renderer.render({ item })
        expect(consoleMock).toHaveBeenCalledOnce();
        expect(consoleMock).toHaveBeenLastCalledWith("There is no plugin registered to handle items of type 'text'");
    });

    it('should render text', () => {
        renderer.register(Text)
        const test = render(<renderer.render item={ item } data-testid="item" />)
        console.log(test.getByTestId("item").children)
        expect(test.getByTestId("item").children).toContain("Test")
    })

})

test("Text plugin", () => {
    const renderer = new Renderer([Text])
    const item = { type: "text", content: "Test"}
    expect (<renderer.render item={ item } />).toEqual(<p>Test</p>)
    expect (<renderer.render.Inline item={ item } />).toEqual(<p>Test</p>)
})