/**
 * AddLeadDrawer.jsx
 * 
 * Reusable Form Drawer for Creating and Editing Leads.
 * 
 * ============================================================================
 * LEARNING NOTES FOR JUNIOR DEVELOPERS:
 * ============================================================================
 * 
 * 1. UNIFIED ADD & EDIT MODES:
 *    Instead of creating two nearly identical forms (`AddLeadDrawer` and `EditLeadDrawer`),
 *    a single component handles both:
 *    - If `leadToEdit` is provided, we populate the fields and display "Edit Lead".
 *    - If `leadToEdit` is null, we clear the fields and display "Add New Lead".
 * 
 * 2. POPULATING FORM DATA WITH REACT HOOK FORM:
 *    `useEffect` listens for changes to `isOpen` and `leadToEdit`.
 *    When the drawer opens, `reset(leadToEdit || defaultValues)` sets all controlled
 *    inputs at once without manual individual state setters.
 * 
 * 3. BACKEND API INTEGRATION:
 *    - In Create mode: Calls `POST /api/leads`
 *    - In Edit mode: Calls `PUT /api/leads/{id}`
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserPlus, Pencil, Save } from "lucide-react";

import Drawer from "../common/Drawer";
import LeadBasicInfo from "./LeadBasicInfo";
import LeadBusinessInfo from "./LeadBusinessInfo";
import LeadAssignment from "./LeadAssignment";

const defaultValues = {
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
  notes: "",
};

const AddLeadDrawer = ({ isOpen, onClose, onSubmit, leadToEdit = null }) => {
  const isEditMode = Boolean(leadToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  });

  // When drawer opens, reset form to default values (Add) or lead data (Edit)
  useEffect(() => {
    if (isOpen) {
      if (leadToEdit) {
        reset({
          companyName: leadToEdit.companyName || "",
          contactPerson: leadToEdit.contactPerson || "",
          phone: leadToEdit.phone || "",
          email: leadToEdit.email || "",
          city: leadToEdit.city || "",
          website: leadToEdit.website || "",
          leadType: leadToEdit.leadType || "",
          industry: leadToEdit.industry || "",
          leadSource: leadToEdit.leadSource || "",
          budget: leadToEdit.budget ? String(leadToEdit.budget) : "",
          status: leadToEdit.status || "New",
          assignedTo: leadToEdit.assignedTo || "",
          notes: leadToEdit.notes || "",
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [isOpen, leadToEdit, reset]);

  // Handle successful form submission
  const handleFormSubmit = async (data) => {
    await onSubmit({
      ...data,
      budget: data.budget ? Number(data.budget) : 0,
      id: leadToEdit ? leadToEdit.id : undefined,
    });

    reset(defaultValues);
    onClose();
  };

  // Handle cancellation and clean form reset
  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  // Action buttons for the drawer footer
  const footerContent = (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
      <button
        type="button"
        onClick={handleClose}
        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
      >
        Cancel
      </button>

      <button
        type="submit"
        form="lead-form"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition"
      >
        <Save size={17} />
        <span>
          {isSubmitting
            ? "Saving..."
            : isEditMode
            ? "Update Lead"
            : "Save Lead"}
        </span>
      </button>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Lead" : "Add New Lead"}
      description={
        isEditMode
          ? `Update information and sales progress for ${leadToEdit?.companyName || "this lead"}.`
          : "Enter customer details to register a new lead in your CRM."
      }
      icon={isEditMode ? Pencil : UserPlus}
      footer={footerContent}
      maxWidth="max-w-[680px]"
    >
      <form
        id="lead-form"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Section 1: Company & Contact Information */}
        <LeadBasicInfo register={register} errors={errors} />

        <div className="border-t border-gray-100" />

        {/* Section 2: Business & Source Categorization */}
        <LeadBusinessInfo register={register} errors={errors} />

        <div className="border-t border-gray-100" />

        {/* Section 3: Internal Team Assignment */}
        <LeadAssignment register={register} errors={errors} />
      </form>
    </Drawer>
  );
};

export default AddLeadDrawer;
