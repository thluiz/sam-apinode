import { Container } from "inversify";

const container = new Container();

export class DependencyManager {
    static get container() {
        return container;
    }
}
