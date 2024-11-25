import { PetStatus } from "../enum/pets.enum";

export interface IPet {
    id: number;
    name: string;
    photoUrls: string[];
    status: PetStatus;
    tags: { id: number; name: string }[];
    category: { id: number; name: string };
}

export type IPetNew = Omit<IPet, 'id'>;
