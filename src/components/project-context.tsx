"use client";

import { Plant } from "@/types/plant";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ProjectPlant extends Plant {
    quantity: number;
}

interface ProjectContextType {
    projectPlants: ProjectPlant[];
    addToProject: (plant: Plant) => void;
    removeFromProject: (code: string) => void;
    updateQuantity: (code: string, quantity: number) => void;
    clearCart: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [projectPlants, setProjectPlants] = useState<ProjectPlant[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("project");
        if (saved) setProjectPlants(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("project", JSON.stringify(projectPlants));
    }, [projectPlants]);

    const addToProject = (plant: Plant) => {
        setProjectPlants((prev) => {
            const existing = prev.find((item) => item.code === plant.code);
            if (existing) {
                return prev.map((item) =>
                    item.code === plant.code ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...plant, quantity: 1 }];
        });
    };

    const removeFromProject = (code: string) => {
        setProjectPlants((prev) => prev.filter((item) => item.code !== code));
    };

    const updateQuantity = (code: string, quantity: number) => {
        setProjectPlants((prev) =>
            prev.map((item) =>
                item.code === code ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    };

    const clearCart = () => setProjectPlants([]);

    return (
        <ProjectContext.Provider value={{ projectPlants, addToProject, removeFromProject, updateQuantity, clearCart }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = (): ProjectContextType => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject must be used within a ProjectProvider");
    }
    return context;
};
