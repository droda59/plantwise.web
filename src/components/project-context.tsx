"use client";

import { getFullPlantName } from "@/lib/utils";
import { Plant } from "@/types/plant";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface ProjectPlant extends Plant {
    quantity: number;
}

interface ProjectContextType {
    projectPlants: ProjectPlant[];
    findInProject: (code: string) => ProjectPlant | undefined;
    addToProject: (plant: Plant, quantity: number) => void;
    removeFromProject: (code: string) => void;
    updateQuantity: (code: string, quantity: number) => void;
    clearCart: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const showToast = (message: string, plant: Plant) =>
    toast.success(message, {
        position: 'top-center',
        description: getFullPlantName(plant),
    });

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [projectPlants, setProjectPlants] = useState<ProjectPlant[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("project");
        if (saved) setProjectPlants(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("project", JSON.stringify(projectPlants));
    }, [projectPlants]);

    const addToProject = (plant: Plant, quantity: number) => {
        setProjectPlants((prev) => {
            const existing = prev.find((item) => item.code === plant.code);
            if (existing) {
                return prev.map((item) =>
                    item.code === plant.code ? { ...item, quantity: quantity } : item
                );
            }
            return [...prev, { ...plant, quantity }];
        });
        showToast('Plante ajoutée au projet', plant);
    };

    const removeFromProject = (code: string) => {
        setProjectPlants((prev) => prev.filter((item) => item.code !== code));
    };

    const findInProject = (code: string): ProjectPlant | undefined => {
        return projectPlants.find((item) => item.code === code);
    }

    const updateQuantity = (code: string, quantity: number) => {
        const plant = findInProject(code);
        if (!plant) return;

        if (quantity === 0) {
            removeFromProject(code)
            showToast('Plante retirée du projet', plant);
        } else {
            setProjectPlants((prev) =>
                prev.map((item) =>
                    item.code === code ? { ...item, quantity: Math.max(1, quantity) } : item
                )
            );
            showToast('Plante modifiée au projet', plant);
        }
    };

    const clearCart = () => setProjectPlants([]);

    return (
        <ProjectContext.Provider value={{ projectPlants, findInProject, addToProject, removeFromProject, updateQuantity, clearCart }}>
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
