import { motion } from "framer-motion";
import React, { useState } from "react";
import { FiArrowRight, FiCheck, FiExternalLink, FiEye, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
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

const EventSelect: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
    const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleSelect = (id: number) => {
        setSelectedTemplate(id);
        // Static flow: send to your event form with selected id in state
        navigate("/events/form", { state: { templateId: id } });
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
        <div className="max-w-6xl bg-white my-16 mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                    Choose Your Event Template
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Pick a professionally designed template to launch your event page in minutes.
                </p>
            </motion.div>

            {/* Grid (single card) */}
            <div className="grid grid-cols-2 gap-6 ">
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
                            className={`relative flex flex-col group border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${isActive
                                ? "border-yellow-400 bg-yellow-50/50 shadow-lg"
                                : "border-gray-200 hover:border-yellow-300 hover:shadow-xl"
                                } overflow-hidden`}
                        >
                            {/* Popular Badge */}
                            {tpl.tags.includes("Popular") && (
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        <FiStar className="w-3 h-3 mr-1 fill-current" />
                                        Popular
                                    </span>
                                </div>
                            )}

                            {/* Image */}
                            <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-6 overflow-hidden">
                                {tpl.imgpath ? (
                                    <img
                                        src={tpl.imgpath}
                                        alt={`${tpl.name} Preview`}
                                        className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                                            <FiExternalLink className="w-8 h-8 text-yellow-500" />
                                        </div>
                                        <span className="text-gray-400 text-center text-sm">
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
                                            className="text-gray-900 text-sm font-medium"
                                        >
                                            Click to select
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">
                                        {tpl.name}
                                    </h3>
                                    {tpl.rating && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FiStar className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                            {tpl.rating}
                                        </div>
                                    )}
                                </div>

                                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                    {tpl.description}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {tpl.features.map((feat, idx) => (
                                        <motion.li
                                            key={idx}
                                            className="flex items-center text-gray-700 text-sm"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <FiCheck className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
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
                                        ? "bg-yellow-500 text-white shadow-md"
                                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
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
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium border transition-all duration-200 ${isActive
                                        ? "border-yellow-400 text-yellow-600"
                                        : "border-gray-300 text-gray-600 hover:border-yellow-300 hover:text-yellow-600"
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
                                    className="absolute top-3 left-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
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
                className="text-center mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <p className="text-gray-600 mb-2">
                    💡 Can't decide? This template is fully customizable after selection!
                </p>
            </motion.div>
        </div>
    );
};

export default EventSelect;
