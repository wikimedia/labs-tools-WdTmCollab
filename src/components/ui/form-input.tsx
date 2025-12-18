import React, { forwardRef } from "react";

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  errorClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
  showRequired?: boolean;
  helperText?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      errorClassName,
      containerClassName,
      labelClassName,
      showRequired,
      helperText,
      className,
      id,
      required,
      disabled,
      placeholder,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const inputId =
      id || `form-input-${Math.random().toString(36).substr(2, 9)}`;

    const describedByIds = [];
    if (error) {
      describedByIds.push(`${inputId}-error`);
    }
    if (helperText) {
      describedByIds.push(`${inputId}-helper`);
    }
    if (ariaDescribedBy) {
      describedByIds.push(ariaDescribedBy);
    }

    const ariaDescribedByValue =
      describedByIds.length > 0 ? describedByIds.join(" ") : undefined;

    return (
      <div className={`w-full ${containerClassName || ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium text-gray-700 mb-1 ${disabled ? "opacity-50" : ""
              } ${labelClassName || ""}`}
          >
            {label}
            {showRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type="text"
          className={`
         w-full px-3 py-3 border rounded-lg shadow-sm transition duration-200 ease-in-out
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
         disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
         placeholder:text-gray-400
         ${error
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 hover:border-gray-400"
            }
         ${className || ""}
       `}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-label={ariaLabel || label}
          aria-describedby={ariaDescribedByValue}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-600">
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={`${inputId}-error`}
            className={`mt-1 text-sm text-red-600 ${errorClassName || ""}`}
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;