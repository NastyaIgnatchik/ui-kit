import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "ui-kit"
import {
  INPUT_DESCRIPTION_TEST,
  INPUT_LABEL_TEST, NOT_EMPTY_ERROR_TEXT,
} from "../constants/constants"
import { expect, fn } from "storybook/test"

const meta = {
  title: "UI/Input",
  component: Input,
  argTypes: {
    disabled: { control: "boolean" },
  },
  args: {
    id: "1",
    placeholder: "Enter the company name",
    label: INPUT_LABEL_TEST,
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    required: true,
    ref: fn(),
  },
  play: async ({ canvas, userEvent, step,args }) => {
    const input = canvas.getByRole("textbox", {
      name: /Company name/i,
    })
    await step("Clicking on the label focuses the input", async () => {
      const label = canvas.getByText(INPUT_LABEL_TEST)
      await userEvent.click(label)
      await expect(input).toHaveFocus()
    })
    await step(
      "Passes the ref to the actual input DOM element",
      async () => {
        await expect(input).toBeInstanceOf(HTMLInputElement)
        await expect(args.ref).toHaveBeenCalledWith(input)
      }
    )
    await step("Passes the required prop", async () => {
      await expect(input).toBeRequired()
    })
    await step("Enters the value", async () => {
      await userEvent.type(input, "Motorland")
      await expect(input).toHaveValue("Motorland")
    })
  },
}

export const DefaultWithoutLabel: Story = {
  args: {
    label: undefined,
  },
}

export const ErrorWithErrorMessage: Story = {
  args: {
    error: NOT_EMPTY_ERROR_TEXT,
    required: true,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox")
    const alert = canvas.getByRole("alert")
    await expect(input).toHaveAttribute("aria-invalid", "true")
    await expect(input).toHaveAttribute("aria-describedby", alert.id)
    await expect(alert).toHaveTextContent(NOT_EMPTY_ERROR_TEXT)
  },
}
export const Error: Story = {
  args: {
    error: "",
    required: true,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox")
    const alert = canvas.queryByRole("alert")

    await expect(input).toHaveAttribute("aria-invalid", "true")
    await expect(alert).not.toBeInTheDocument()
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    required: true,
  },
}

export const Hovered: Story = {
  args: { required: true },
  parameters: {
    pseudo: { hover: true },
  },
}

export const Focused: Story = {
  args: { required: true },
  parameters: {
    pseudo: { focusVisible: true },
  },
}

export const Description: Story = {
  args: {
    required: true,
    description: INPUT_DESCRIPTION_TEST,
  },
}
