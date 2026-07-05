import { Button } from "@astryxdesign/core/Button";
import { Dialog } from "@astryxdesign/core/Dialog";
import { Heading } from "@astryxdesign/core/Heading";
import { Selector } from "@astryxdesign/core/Selector";
import { Text } from "@astryxdesign/core/Text";
import { TextArea } from "@astryxdesign/core/TextArea";
import { TextInput } from "@astryxdesign/core/TextInput";
import * as stylex from "@stylexjs/stylex";
import { FormEvent, useState } from "react";
import { createProject } from "@/entities/project/api";
import { ProjectType } from "@/entities/project/model";
import { ApiError } from "@/shared/api/http";

const styles = stylex.create({
  form: {
    display: "grid",
    gap: 18
  },
  header: {
    display: "grid",
    gap: 8
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 6
  },
  errorBox: {
    border: "1px solid #f3b4b4",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff5f5",
    color: "#8a1f1f"
  }
});

const projectTypeOptions: Array<{ value: ProjectType; label: string }> = [
  { value: "ESTIMATE_REVIEW", label: "견적 검토" },
  { value: "PROPOSAL_REVIEW", label: "제안 검토" },
  { value: "CONTRACT_REVIEW", label: "계약 검토" },
  { value: "MEETING_NOTE_SUMMARY", label: "회의록 정리" },
  { value: "GENERAL_DOCUMENT_ANALYSIS", label: "일반 문서 분석" }
];

const DEFAULT_PROJECT_TYPE: ProjectType = "PROPOSAL_REVIEW";

export function CreateProjectDialog({
  isOpen,
  onOpenChange,
  onCreated
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ProjectType>(DEFAULT_PROJECT_TYPE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();
  const isNameInvalid = trimmedName.length === 0 || trimmedName.length > 100;
  const isDescriptionInvalid = trimmedDescription.length > 1000;
  const canSubmit = !isNameInvalid && !isDescriptionInvalid && !isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage("프로젝트명은 1자 이상 100자 이하로 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createProject({
        name: trimmedName,
        description: trimmedDescription.length > 0 ? trimmedDescription : null,
        type
      });
      resetForm();
      onOpenChange(false);
      onCreated();
    } catch (error) {
      setErrorMessage(toCreateProjectErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOpenChange(nextIsOpen: boolean) {
    if (isSubmitting) {
      return;
    }

    if (!nextIsOpen) {
      resetForm();
    }

    onOpenChange(nextIsOpen);
  }

  function resetForm() {
    setName("");
    setDescription("");
    setType(DEFAULT_PROJECT_TYPE);
    setErrorMessage(null);
  }

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      purpose="form"
      width={520}
      padding={5}
    >
      <form {...stylex.props(styles.form)} onSubmit={handleSubmit}>
        <div {...stylex.props(styles.header)}>
          <Heading level={2}>새 프로젝트</Heading>
          <Text type="supporting" display="block">
            문서 분석을 시작할 프로젝트 정보를 입력합니다.
          </Text>
        </div>

        <TextInput
          label="프로젝트명"
          value={name}
          placeholder="예: A사 제안서 검토"
          isRequired
          isDisabled={isSubmitting}
          status={
            name.length > 0 && isNameInvalid
              ? { type: "error", message: "프로젝트명은 100자 이하로 입력해주세요." }
              : undefined
          }
          onChange={setName}
        />

        <Selector
          label="프로젝트 유형"
          value={type}
          options={projectTypeOptions}
          isDisabled={isSubmitting}
          onChange={(nextType) => setType(nextType as ProjectType)}
        />

        <TextArea
          label="설명"
          value={description}
          placeholder="검토 대상, 고객사, 업무 범위를 간단히 적어주세요."
          isOptional
          isDisabled={isSubmitting}
          status={
            isDescriptionInvalid
              ? { type: "error", message: "설명은 1000자 이하로 입력해주세요." }
              : undefined
          }
          onChange={setDescription}
        />

        {errorMessage ? (
          <div {...stylex.props(styles.errorBox)}>
            <Text weight="medium" display="block">
              {errorMessage}
            </Text>
          </div>
        ) : null}

        <div {...stylex.props(styles.actions)}>
          <Button
            label="취소"
            variant="secondary"
            isDisabled={isSubmitting}
            onClick={() => handleOpenChange(false)}
          />
          <Button
            label="프로젝트 생성"
            variant="primary"
            type="submit"
            isDisabled={!canSubmit}
            isLoading={isSubmitting}
          />
        </div>
      </form>
    </Dialog>
  );
}

function toCreateProjectErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 422) {
      return "입력값을 확인해주세요.";
    }

    return `서버가 ${error.status} 응답을 반환했습니다.`;
  }

  if (error instanceof TypeError) {
    return "백엔드 서버에 연결할 수 없습니다.";
  }

  return "프로젝트를 생성하지 못했습니다.";
}
