import FormField from "../common/FormField";

const leadTypes = [
    { value: "product_inquiry", label: "Product Inquiry" },
    { value: "service_inquiry", label: "Service Inquiry" },
    { value: "general_inquiry", label: "General Inquiry" },
    { value: "partnership", label: "Partnership" },
    { value: "other", label: "Other" }
];

const industries = [
    { value: "real_estate", label: "Real Estate" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "information_technology", label: "Information Technology" },
    { value: "other", label: "Other" }
];

const leadSources = [
    { value: "website", label: "Website" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "referral", label: "Referral" },
    { value: "cold_call", label: "Cold Calling" },
    { value: "justdial", label: "Justdial" },
    { value: "indiamart", label: "IndiaMART" },
    { value: "social_media", label: "Social Media" },
    { value: "other", label: "Other" }
];

const LeadBusinessInfo = ({ register, errors }) => {
    return (
        <section className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-gray-800">
                    Lead Information
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                    Categorize the lead and record its source.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                    label="Lead Type"
                    name="leadType"
                    register={register}
                    error={errors.leadType}
                    required
                    options={leadTypes}
                    rules={{ required: "Please select a lead type." }}
                />

                <FormField
                    label="Industry"
                    name="industry"
                    register={register}
                    error={errors.industry}
                    options={industries}
                />

                <FormField
                    label="Lead Source"
                    name="leadSource"
                    register={register}
                    error={errors.leadSource}
                    required
                    options={leadSources}
                    rules={{ required: "Please select a lead source." }}
                />

                <FormField
                    label="Estimated Budget (₹)"
                    name="budget"
                    type="number"
                    register={register}
                    error={errors.budget}
                    placeholder="Enter estimated budget"
                    min="0"
                    rules={{
                        min: {
                            value: 0,
                            message: "Budget cannot be negative."
                        }
                    }}
                />

                <FormField
                    label="Lead Status"
                    name="status"
                    register={register}
                    error={errors.status}
                    options={[
                        { value: "New", label: "New" },
                        { value: "Contacted", label: "Contacted" },
                        { value: "Interested", label: "Interested" },
                        { value: "Qualified", label: "Qualified" },
                        { value: "Proposal Sent", label: "Proposal Sent" },
                        { value: "Won", label: "Won" },
                        { value: "Lost", label: "Lost" },
                        { value: "Nurture", label: "Nurture" }
                    ]}
                />
            </div>

            <FormField
                label="Lead Notes"
                name="notes"
                register={register}
                error={errors.notes}
                placeholder="Enter requirements, discussion details or additional information..."
                rows={3}
            />
        </section>
    );
};

export default LeadBusinessInfo;