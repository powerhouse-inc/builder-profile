/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  reducer,
  utils,
  isBuilderProfileDocument,
  updateProfile,
  UpdateProfileInputSchema,
} from "@powerhousedao/builder-profile/document-models/builder-profile";

describe("Builder Operations", () => {
  it("should handle updateProfile operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateProfileInputSchema());

    const updatedDocument = reducer(document, updateProfile(input));

    expect(isBuilderProfileDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_PROFILE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
