import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button, Input, type InputProps } from "ui-kit"
import {
  INPUT_DESCRIPTION_TEST,
  INPUT_LABEL_TEST,
  NOT_EMPTY_ERROR_TEXT,
  VALUE_LENGTH_EXCEEDED_ERROR_TEXT,
} from "../constants/constants"
import { z } from "zod"
import type { SubmitHandler } from "react-hook-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { expect, fn } from "storybook/test"

export type InputRHFProps = Omit<InputProps, "onSubmit"> & {
  onSubmit?: SubmitHandler<{ companyName: string }>
}

const schema = z.object({
  companyName: z
    .string()
    .max(50, { message: VALUE_LENGTH_EXCEEDED_ERROR_TEXT })
    .nonempty({ message: NOT_EMPTY_ERROR_TEXT }),
})

const meta = {
  title: "UI/InputRHF",
  component: function FormInputRHF({
    onSubmit = () => {},
    ...props
  }: InputRHFProps) {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
    })
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...props}
          {...register("companyName")}
          placeholder="Company name"
          error={errors.companyName?.message}
        />
        <Button
          type="submit"
        >
          Submit
        </Button>
      </form>
    )
  },
  argTypes: {
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "Enter the company name",
    label: INPUT_LABEL_TEST,
  },
} satisfies Meta<InputRHFProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSubmit: fn(),
    description: INPUT_DESCRIPTION_TEST,
  },
  play: async ({ canvas, userEvent, step,args }) => {
    const input = canvas.getByRole("textbox")
    const submitButton = canvas.getByRole("button", { name: "Submit" })

    await step("Successful submits form value", async () => {
      await userEvent.type(input, "Motorland")
      await userEvent.click(submitButton)
      await expect(args.onSubmit).toHaveBeenCalledWith(
        { companyName: "Motorland" },
        expect.anything()
      )
      const alert = canvas.queryByRole("alert")
      await expect(alert).not.toBeInTheDocument()
      await expect(input).toHaveAttribute("aria-invalid", "false")
    })
  },
}

export const EmptyFieldError: Story = {
  play: async ({ canvas, userEvent, step }) => {
    const input = canvas.getByRole("textbox")
    const submitButton = canvas.getByRole("button", { name: "Submit" })

    await step("Empty field is not valid", async () => {
      await userEvent.click(submitButton)
      const alert = canvas.getByRole("alert")
      await expect(alert).toHaveTextContent(NOT_EMPTY_ERROR_TEXT)
      await expect(input).toHaveAttribute("aria-invalid", "true")
      await expect(input).toHaveAttribute("aria-describedby", alert.id)
    })
  },
}

export const MaximumLengthIsExceededError: Story = {
  args:{
    description: INPUT_DESCRIPTION_TEST,
  },
  play: async ({ canvas, userEvent, step }) => {
    const input = canvas.getByRole("textbox")
    const submitButton = canvas.getByRole("button", { name: "Submit" })

    await step("Maximum length is exceeded", async () => {
      const description = canvas.getByText(INPUT_DESCRIPTION_TEST)
      await expect(description).toHaveTextContent(INPUT_DESCRIPTION_TEST)

      await userEvent.type(input, "A".repeat(51))
      await userEvent.click(submitButton)
      const alert = canvas.getByRole("alert")
      await expect(alert).toHaveTextContent(VALUE_LENGTH_EXCEEDED_ERROR_TEXT)
      await expect(input).toHaveAttribute("aria-invalid", "true")
      await expect(input).toHaveAttribute("aria-describedby", alert.id)
      await expect(description).not.toBeInTheDocument()
    })
  },
}
