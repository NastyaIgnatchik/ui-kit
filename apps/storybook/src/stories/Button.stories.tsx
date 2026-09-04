import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "ui-kit"
import { Save } from "lucide-react"
import { BUTTON_CHILDREN_TEST } from "../constants/constants"
import { expect, fn } from "storybook/test"

const meta = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon"],
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    children: BUTTON_CHILDREN_TEST,
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: "default",
    onClick: fn(),
    ref: fn(),
  },
  play: async ({ canvas, userEvent, args, step }) => {
    const button = canvas.getByRole("button", { name: BUTTON_CHILDREN_TEST })
    await step("Renders button and passed text", async () => {
      await expect(button).toBeVisible()
      await expect(button).toHaveTextContent(BUTTON_CHILDREN_TEST)
    })
    await step("Passes the ref to the actual button DOM element", async () => {
      await expect(button).toBeInstanceOf(HTMLButtonElement)
      await expect(args.ref).toHaveBeenCalledWith(button)
    })
    await step("Gets focused", async () => {
      await userEvent.tab()
      await expect(button).toHaveFocus()
    })
    await step("Calls onClick on Enter", async () => {
      await userEvent.keyboard("{Enter}")
      await expect(args.onClick).toHaveBeenCalledTimes(1)
    })
    await step("Calls onClick", async () => {
      await userEvent.click(button)
      await expect(args.onClick).toHaveBeenCalledTimes(2)
    })
  },
}

export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
}

export const Hovered: Story = {
  parameters: {
    pseudo: { hover: true },
  },
  argTypes: {
    disabled: { control: false },
  },
}

export const Focused: Story = {
  parameters: {
    pseudo: { focusVisible: true },
  },
  argTypes: {
    disabled: { control: false },
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole("button")
    await expect(button).toBeDisabled()
    await userEvent.tab()
    await expect(button).not.toHaveFocus()
  },
}

export const Icon: Story = {
  args: {
    children: <Save />,
    size: "icon",
    "aria-label": "Save",
  },
}

export const IconAndText: Story = {
  args: {
    children: (
      <>
        <Save /> Save
      </>
    ),
  },
}
