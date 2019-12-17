"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function App(context) {
    await context.sendText('Welcome to Bottender');
}
exports.default = App;
