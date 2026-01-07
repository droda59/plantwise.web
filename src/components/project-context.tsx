"use client";

import { getFullPlantName } from "@/lib/utils";
import { Plant } from "@/types/plant";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface ProjectPlant extends Plant { }

interface ProjectContextType {
    projectPlants: ProjectPlant[];
    findInProject: (code: string) => ProjectPlant | undefined;
    addToProject: (plant: Plant) => void;
    removeFromProject: (plant: Plant) => void;
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

    const addToProject = (plant: Plant) => {
        const existing = projectPlants.find((item) => item.code === plant.code);
        if (!existing) {
            setProjectPlants((prev) => {
                return [...prev, { ...plant }];
            });
        }
        showToast('Plante ajoutée au projet', plant);
    };

    const removeFromProject = (plant: Plant) => {
        const existing = projectPlants.find((item) => item.code === plant.code);
        if (existing) {
            setProjectPlants((prev) => prev.filter((item) => item.code !== plant.code));
            showToast('Plante retirée du projet', plant);
        }
    };

    const findInProject = (code: string): ProjectPlant | undefined => {
        return projectPlants.find((item) => item.code === code);
    }

    const clearCart = () => setProjectPlants([]);

    return (
        <ProjectContext.Provider value={{ projectPlants, findInProject, addToProject, removeFromProject, clearCart }}>
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
