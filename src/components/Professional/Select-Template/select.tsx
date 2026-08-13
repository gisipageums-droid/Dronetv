import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Only one professional template is offered — this page used to let users
// pick between two, but that choice was removed. It just forwards straight
// to the form with the single supported template pre-selected.
const ONLY_TEMPLATE_ID = 1;

export default function ProfessionalTemplateSelector() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/professional/form", { replace: true, state: { templateId: ONLY_TEMPLATE_ID } });
    }, [navigate]);

    return null;
}
