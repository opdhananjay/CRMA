const FormField = ({
    label,
    name,
    register,
    error,
    required = false,
    type = "text",
    placeholder = "",
    options,
    rows,
    rules = {},
    ...props
}) => {
    const baseClass = `
        w-full rounded-lg border bg-white px-3 py-2.5
        text-sm text-gray-800 outline-none transition
        placeholder:text-gray-400
        focus:border-blue-500 focus:ring-2 focus:ring-blue-100
        ${error ? "border-red-400" : "border-gray-200"}
    `;

    return (
        <div className="w-full min-w-0">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>

            {options ? (
                <select
                    {...register(name, rules)}
                    className={baseClass}
                    {...props}
                >
                    <option value="">Select {label.toLowerCase()}</option>

                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : rows ? (
                <textarea
                    {...register(name, rules)}
                    rows={rows}
                    placeholder={placeholder}
                    className={`${baseClass} resize-y`}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    {...register(name, rules)}
                    placeholder={placeholder}
                    className={baseClass}
                    {...props}
                />
            )}

            {error && (
                <p className="mt-1 text-xs text-red-500">
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default FormField;