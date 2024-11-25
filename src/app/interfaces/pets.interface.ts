import { PetStatus } from "../enum/pets.enum";
import { ITag } from "./tags.interface";

export interface IPet {
    id: number;
    name: string;
    photoUrls: string[];
    status: PetStatus;
    tags: ITag[];
    category: { id: number; name: string };
}

export type IPetNew = Omit<IPet, 'id'>;
