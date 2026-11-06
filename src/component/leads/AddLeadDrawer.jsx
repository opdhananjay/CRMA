import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, UserPlus, Save } from "lucide-react";

import LeadBasicInfo from "./LeadBasicInfo";
import LeadBusinessInfo from "./LeadBusinessInfo";
import LeadAssignment from "./LeadAssignment";

const AddLeadDrawer = ({ isOpen, onClose, onSubmit }) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            companyName: "",
            contactPerson: "",
            phone: "",
            email: "",
            city: "",
            website: "",
            leadType: "",
            industry: "",
            leadSource: "",
            budget: "",
            status: "New",
            assignedTo: "",
            notes: ""
        }
    });

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    const handleFormSubmit = async (data) => {
        await onSubmit({
            ...data,
            budget: data.budget ? Number(data.budget) : null
        });

        reset();
        onClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={handleClose}
            />

            {/* Drawer */}
            <div className="relative flex h-full w-full max-w-[680px]
                            flex-col bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between
                                border-b border-gray-200 px-5 py-4 sm:px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center
                                        justify-center rounded-lg bg-blue-50">
                            <UserPlus className="text-blue-600" size={21} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Add New Lead
                            </h2>

                            <p className="text-xs text-gray-500">
                                Enter the lead information below.
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg p-2 text-gray-500
                                   hover:bg-gray-100 hover:text-gray-800"
                    >
                        <X size={21} />
                    </button>

                </div>

                {/* Form Content */}
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="flex min-h-0 flex-1 flex-col"
                >

                    <div className="flex-1 space-y-7 overflow-y-auto
                                    px-5 py-6 sm:px-6">

                        <LeadBasicInfo
                            register={register}
                            errors={errors}
                        />

                        <div className="border-t border-gray-100" />

                        <LeadBusinessInfo
                            register={register}
                            errors={errors}
                        />

                        <div className="border-t border-gray-100" />

                        <LeadAssignment
                            register={register}
                            errors={errors}
                        />

                    </div>

                    {/* Footer */}
                    <div className="flex flex-col-reverse gap-3
                                    border-t border-gray-200 bg-white
                                    px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-lg border border-gray-300
                                       px-5 py-2.5 text-sm font-medium
                                       text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center justify-center
                                       gap-2 rounded-lg bg-blue-600
                                       px-5 py-2.5 text-sm font-medium
                                       text-white hover:bg-blue-700
                                       disabled:cursor-not-allowed
                                       disabled:opacity-60"
                        >
                            <Save size={17} />
                            {isSubmitting ? "Saving..." : "Save Lead"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddLeadDrawer;