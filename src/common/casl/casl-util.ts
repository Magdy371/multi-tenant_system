import { subject as bindSubject } from "@casl/ability";
import { AppAbility, Actions, Subjects } from "./casl-ability.factory";
import { CheckPolicies } from "../../modules/auth/decorators/check-policies.decorator";
export interface RequiredRule {
    action: Actions;
    subject: Subjects;
    field?: string;
    conditions?: Record<string, unknown>;
}
export const createPolicyHandler = (rule: Pick<RequiredRule, "action" | "subject">) => {
    return (ability: AppAbility) =>
        ability.can(rule.action, rule.subject);
};
export const createPolicyHandlerWithField = (rule: RequiredRule & { field: string }) => {
    return (ability: AppAbility) => ability.can(rule.action, rule.subject, rule.field);
};

export const createPolicyHandlerWithConditions = (
    rule: RequiredRule & { conditions: Record<string, unknown> },
) => {
    return (ability: AppAbility) =>
        ability.can(rule.action, bindSubject(rule.subject, rule.conditions));
};
// Convenience decorators for common actions
export const CanCreate = (subject: Subjects) => CheckPolicies(createPolicyHandler({ action: "create", subject }));
export const CanRead = (subject: Subjects) => CheckPolicies(createPolicyHandler({ action: "read", subject }));
export const CanUpdate = (subject: Subjects) => CheckPolicies(createPolicyHandler({ action: "update", subject }));
export const CanDelete = (subject: Subjects) => CheckPolicies(createPolicyHandler({ action: "delete", subject }));
export const CanManage = (subject: Subjects) => CheckPolicies(createPolicyHandler({ action: "manage", subject }));
