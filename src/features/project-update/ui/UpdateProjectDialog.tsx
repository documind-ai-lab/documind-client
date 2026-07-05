import { Button } from "@astryxdesign/core/Button";
import { Dialog } from "@astryxdesign/core/Dialog";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { TextArea } from "@astryxdesign/core/TextArea";
import { TextInput } from "@astryxdesign/core/TextInput";
import * as stylex from "@stylexjs/stylex";
import { FormEvent, useEffect, useState } from "react";
import { updateProject } from "@/entities/project/api";
import { ProjectSummary } from "@/entities/project/model";
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
    marginTop: 6,
    "@media (max-width: 560px)": {
      flexDirection: "column"
    }
  },
  errorBox: {
    border: "1px solid #f3b4b4",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff5f5",
    color: "#8a1f1f"
  }
});

export function UpdateProjectDialog({
  project,
  isOpen,
  onOpenChange,
  onUpdated
}: {
  project: ProjectSummary | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdated: (project: ProjectSummary) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!project || !isOpen) {
      return;
    }

    setName(project.name);
    setDescription(project.description ?? "");
    setErrorMessage(null);
  }, [project, isOpen]);

  const trimmedName = name.trim();
  const trimmedDescription = description.trim();
  const isNameInvalid = trimmedName.length === 0 || trimmedName.length > 100;
  const isDescriptionInvalid = trimmedDescription.length > 1000;
  const canSubmit = Boolean(project) && !isNameInvalid && !isDescriptionInvalid && !isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!project || !canSubmit) {
      setErrorMessage("프로젝트명은 1자 이상 100자 이하로 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const updatedProject = await updateProject(project.id, {
        name: trimmedName,
        description: trimmedDescription.length > 0 ? trimmedDescription : null
      });

      onUpdated(updatedProject);
      onOpenChange(false);
    } catch (error) {
      setErrorMessage(toUpdateProjectErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOpenChange(nextIsOpen: boolean) {
    if (isSubmitting) {
      return;
    }

    if (!nextIsOpen) {
      setErrorMessage(null);
    }

    onOpenChange(nextIsOpen);
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
          <Heading level={2}>프로젝트 정보 수정</Heading>
          <Text type="supporting" display="block">
            프로젝트명과 설명을 현재 업무 기준에 맞게 정리합니다.
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
            label="저장"
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

function toUpdateProjectErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return "프로젝트 주소 형식이 올바르지 않습니다.";
    }

    if (error.status === 404) {
      return "프로젝트를 찾을 수 없습니다.";
    }

    if (error.status === 422) {
      return "입력값을 확인해주세요.";
    }

    return `서버가 ${error.status} 응답을 반환했습니다.`;
  }

  if (error instanceof TypeError) {
    return "백엔드 서버에 연결할 수 없습니다.";
  }

  return "프로젝트 정보를 수정하지 못했습니다.";
}
