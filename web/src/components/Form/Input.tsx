import { InputHTMLAttributes } from "react";

// interface FormInputProps extends Inpu tHTMLAttributes<HTMLInputElement> {}

export function FormInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500"
    />
  );
}
