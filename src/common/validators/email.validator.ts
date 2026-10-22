import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

// Common disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = [
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com",
    "throwaway.email",
    "temp-mail.org",
    "getnada.com",
    "maildrop.cc",
    "trashmail.com",
    "yopmail.com",
    "fakeinbox.com",
    "sharklasers.com",
    "guerrillamail.info",
    "grr.la",
    "guerrillamailblock.com",
    "spam4.me",
    "tempinbox.com",
    "dispostable.com",
    "mintemail.com",
    "emailondeck.com",
];

@ValidatorConstraint({ async: false })
export class IsNotDisposableEmailConstraint implements ValidatorConstraintInterface {
    validate(email: String) {
        if (!email || typeof email !== "string") {
            return false;
        }
        const domain = email.split("@")[1]?.toLowerCase();
        if (!domain) {
            return false;
        }
        return !DISPOSABLE_EMAIL_DOMAINS.includes(domain);
    }
    defaultMessage() {
        return "Disposable email addresses are not allowed";
    }
}

export function IsNotDisposableEmail(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNotDisposableEmailConstraint,
        });
    };
}