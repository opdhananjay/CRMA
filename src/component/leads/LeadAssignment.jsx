import FormField from "../common/FormField";

const LeadAssignment = ({ register, errors }) => {
    const employees = [
        { value: "user-1", label: "Rahul Sharma" },
        { value: "user-2", label: "Priya Patel" },
        { value: "user-3", label: "Amit Shah" }
    ];

    return (
        <section className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-gray-800">
                    Lead Assignment
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                    Assign this lead to a team member.
                </p>
            </div>

            <FormField
                label="Assigned To"
                name="assignedTo"
                register={register}
                error={errors.assignedTo}
                options={employees}
            />
        </section>
    );
};

export default LeadAssignment;