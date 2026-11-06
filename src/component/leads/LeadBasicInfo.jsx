import FormField from "../common/FormField";

const LeadBasicInfo = ({ register, errors }) => {
    return (
        <section className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-gray-800">
                    Company & Contact Information
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                    Enter the company and primary contact details.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    label="Company Name"
                    name="companyName"
                    register={register}
                    error={errors.companyName}
                    required
                    placeholder="Enter company name"
                    rules={{
                        required: "Company name is required."
                    }}
                />

                <FormField
                    label="Contact Person"
                    name="contactPerson"
                    register={register}
                    error={errors.contactPerson}
                    required
                    placeholder="Enter contact person"
                    rules={{
                        required: "Contact person is required."
                    }}
                />

                <FormField
                    label="Phone Number"
                    name="phone"
                    register={register}
                    error={errors.phone}
                    required
                    placeholder="Enter phone number"
                    rules={{
                        required: "Phone number is required.",
                        validate: (value) => {
                            const digits = value.replace(/\D/g, "");
                            return (
                                (digits.length >= 7 && digits.length <= 15) ||
                                "Enter a valid phone number."
                            );
                        }
                    }}
                />

                <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                    placeholder="example@company.com"
                    rules={{
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email address."
                        }
                    }}
                />

                <FormField
                    label="City"
                    name="city"
                    register={register}
                    error={errors.city}
                    placeholder="Enter city"
                />

                <FormField
                    label="Website"
                    name="website"
                    register={register}
                    error={errors.website}
                    placeholder="https://example.com"
                    rules={{
                        validate: (value) => {
                            if (!value) return true;

                            try {
                                const url = new URL(
                                    /^https?:\/\//i.test(value)
                                        ? value
                                        : `https://${value}`
                                );

                                return (
                                    url.hostname.includes(".") ||
                                    "Enter a valid website URL."
                                );
                            } catch {
                                return "Enter a valid website URL.";
                            }
                        }
                    }}
                />
            </div>
        </section>
    );
};

export default LeadBasicInfo;