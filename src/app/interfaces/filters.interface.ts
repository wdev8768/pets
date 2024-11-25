import { PetStatus } from "../enum/pets.enum";

export interface IFiltersPets {
    status: PetStatus;
    name: string;
}
