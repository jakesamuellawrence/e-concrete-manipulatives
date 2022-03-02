/**
 * enum for what error trying to bundle might display.
 * The mesasge to be displayed is also embedded in the enum value
 */
export class BundleErrType {
    static NONE_SELECTED = new BundleErrType("Nothing is selected. Please click on some sticks to select them.");
    static TOO_FEW = new BundleErrType("You have not selected enough things.");
    static TOO_MANY = new BundleErrType("You have selected too many things.");
    static DIFF_TYPES = new BundleErrType("You cannot bundle different types of things.");

    constructor(message) {
        this.err_message = message;
    }
}