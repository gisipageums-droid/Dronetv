import { motion } from "framer-motion";
import React, { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheck, FiExternalLink, FiEye, FiStar } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import TPL1 from "/images/event t1.png";

const TPL2 =
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1200&auto=format&fit=crop";
type Template = {
    id: number;
    name: string;
    imgpath?: string;
    description: string;
    features: string[];
    path: string;
    rating?: number;
    tags: string[];
};

const templates: Template[] = [
    {
        id: 1,
        name: "formal Event Template",
        imgpath: TPL1,
        description:
            "Clean design with bright hero section — perfect for conferences and meetups.",
        features: ["Hero Section", "Schedule", "Speakers", "Responsive Design"],
        path: "/preview/event/t1",
        rating: 5,
        tags: ["formal"],
    },
    // {
    //     id: 2,
    //     name: "Modern Event Template",
    //     imgpath: "../images/select.jpg",
    //     description:
    //         "Clean design with bright hero section — perfect for conferences and meetups.",
    //     features: ["Hero Section", "Schedule", "Speakers", "Responsive Design"],
    //     path: "/preview/event/t2",
    //     rating: 4.8,
    //     tags: ["Modern", "Popular"],
    // },
];

const EVENT_TYPES: { id: string; label: string; description: string }[] = [
    { id: "event", label: "Event", description: "General events that don't fit a specific category" },
    { id: "expo", label: "Expo", description: "Exhibitions, trade shows, product showcases" },
    { id: "conference", label: "Conference", description: "Talks, summits, industry conferences" },
    { id: "workshop", label: "Workshop", description: "Hands-on training and skill-building sessions" },
];

const EventSelect: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
    const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);
    const location = useLocation();
    const preselectedType = (location.state as { eventType?: string } | null)?.eventType || "";
    const [eventType, setEventType] = useState<string>(preselectedType);
    const navigate = useNavigate();

    const handleSelect = (id: number) => {
        if (!eventType) return;
        setSelectedTemplate(id);
        // Static flow: send to your event form with selected id in state
        navigate("/events/form", { state: { templateId: id, eventType } });
        // navigate("/user/event/t2", { state: { templateId: id } });
    };

    const handlePreview = (
        path: string,
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.stopPropagation();
        navigate(path);
    };

    return (
        <div className="w-full max-w-2xl bg-surface-card my-8 mx-auto px-4 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-ink-paragraph hover:text-brand-yellow transition-colors mb-8 text-sm font-medium"
            >
                <FiArrowLeft className="w-4 h-4" />
                Back
            </button>

            {/* Header */}
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-yellow to-brand-gold bg-clip-text text-transparent">
                    Choose Your Event Template
                </h1>
                <p className="text-ink-paragraph text-lg max-w-2xl mx-auto">
                    Pick a professionally designed template to launch your event page in minutes.
                </p>
            </motion.div>

            {/* What are you creating? */}
            <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <h2 className="text-lg font-semibold text-ink mb-1">What are you creating?</h2>
                <p className="text-sm text-ink-caption mb-4">Choose a category — this decides where your listing shows up (Events, Expos, Conferences or Workshops).</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {EVENT_TYPES.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setEventType(t.id)}
                            className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${eventType === t.id
                                ? "border-brand-yellow bg-surface-main shadow-md"
                                : "border-ink-light hover:border-brand-yellow-soft"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-ink">{t.label}</span>
                                {eventType === t.id && <FiCheck className="w-4 h-4 text-brand-gold" />}
                            </div>
                            <p className="text-xs text-ink-caption">{t.description}</p>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Grid (single card) */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity ${!eventType ? "opacity-50 pointer-events-none" : ""}`}>
                {!eventType && (
                    <p className="col-span-full text-sm text-brand-gold bg-surface-main border border-brand-yellow-soft rounded-lg px-4 py-2 -mt-2 mb-2">
                        Pick a category above to continue.
                    </p>
                )}
                {templates.map((tpl) => {
                    const isActive = selectedTemplate === tpl.id;
                    const isHovered = hoveredTemplate === tpl.id;

                    return (
                        <motion.div
                            key={tpl.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: tpl.id * 0.1 }}
                            whileHover={{ y: -5 }}
                            onMouseEnter={() => setHoveredTemplate(tpl.id)}
                            onMouseLeave={() => setHoveredTemplate(null)}
                            onClick={() => handleSelect(tpl.id)}
                            className={`relative flex flex-col group border-2 rounded-xl p-4 sm:p-6 cursor-pointer transition-all duration-300 w-full min-w-0 ${isActive
                                ? "border-brand-yellow bg-surface-main/50 shadow-lg"
                                : "border-ink-light hover:border-brand-yellow-soft hover:shadow-xl"
                                }`}
                        >
                            {/* Popular Badge */}
                            {tpl.tags.includes("Popular") && (
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-yellow-soft text-brand-gold">
                                        <FiStar className="w-3 h-3 mr-1 fill-current" />
                                        Popular
                                    </span>
                                </div>
                            )}

                            {/* Image */}
                            <div className="relative h-56 bg-gradient-to-br from-ink-offwhite to-ink-light rounded-lg mb-6 overflow-hidden">
                                {tpl.imgpath ? (
                                    <img
                                        src={tpl.imgpath}
                                        alt={`${tpl.name} Preview`}
                                        className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                        <div className="w-16 h-16 bg-brand-yellow-soft rounded-full flex items-center justify-center mb-4">
                                            <FiExternalLink className="w-8 h-8 text-brand-gold" />
                                        </div>
                                        <span className="text-ink-caption text-center text-sm">
                                            Preview coming soon
                                        </span>
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-20 flex items-center justify-center">
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-ink text-sm font-medium"
                                        >
                                            Click to select
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-semibold text-ink group-hover:text-brand-yellow transition-colors">
                                        {tpl.name}
                                    </h3>
                                    {tpl.rating && (
                                        <div className="flex items-center text-sm text-ink-paragraph">
                                            <FiStar className="w-4 h-4 text-brand-yellow fill-current mr-1" />
                                            {tpl.rating}
                                        </div>
                                    )}
                                </div>

                                <p className="text-ink-paragraph mb-4 text-sm leading-relaxed">
                                    {tpl.description}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {tpl.features.map((feat, idx) => (
                                        <motion.li
                                            key={idx}
                                            className="flex items-center text-ink-paragraph text-sm"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <FiCheck className="w-4 h-4 mr-2 text-status-success flex-shrink-0" />
                                            <span>{feat}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex-1 ${isActive
                                        ? "bg-brand-gold text-ink shadow-md"
                                        : "bg-brand-yellow-soft text-brand-gold hover:bg-brand-yellow-soft"
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelect(tpl.id);
                                    }}
                                >
                                    {isActive ? "Selected" : "Select Template"}
                                    <FiArrowRight
                                        className={`w-4 h-4 transition-transform ${isActive ? "transform group-hover:translate-x-1" : ""
                                            }`}
                                    />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium border transition-all duration-200 flex-1 ${isActive
                                        ? "border-brand-yellow text-brand-gold"
                                        : "border-ink-light text-ink-paragraph hover:border-brand-yellow-soft hover:text-brand-yellow"
                                        }`}
                                    onClick={(e) => handlePreview(tpl.path, e)}
                                    disabled={!tpl.imgpath}
                                >
                                    <FiEye className="w-4 h-4" />
                                    Preview
                                </motion.button>
                            </div>

                            {/* Selection Indicator */}
                            {isActive && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 left-3 w-6 h-6 bg-brand-yellow rounded-full flex items-center justify-center"
                                >
                                    <FiCheck className="w-4 h-4 text-white" />
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            <motion.div
                className="text-center mt-12 p-6 bg-ink-offwhite rounded-xl border border-ink-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <p className="text-ink-paragraph mb-2">
                    💡 Can't decide? This template is fully customizable after selection!
                </p>
            </motion.div>
        </div>
    );
};

export default EventSelect;
