import { Button } from "@astryxdesign/core/Button";
import { Dialog } from "@astryxdesign/core/Dialog";
import { FileInput } from "@astryxdesign/core/FileInput";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import * as stylex from "@stylexjs/stylex";
import { FormEvent, useState } from "react";
import { uploadDocument } from "@/entities/document/api";
import { DocumentSummary } from "@/entities/document/model";
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

export function UploadDocumentDialog({
  projectId,
  isOpen,
  onOpenChange,
  onUploaded
}: {
  projectId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUploaded: (document: DocumentSummary) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const canSubmit = file !== null && !isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setErrorMessage("업로드할 문서를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const document = await uploadDocument({ projectId, file });
      resetForm();
      onOpenChange(false);
      onUploaded(document);
    } catch (error) {
      setErrorMessage(toUploadDocumentErrorMessage(error));
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

  function handleFileChange(nextFile: File | File[] | null) {
    setErrorMessage(null);
    setFile(nextFile instanceof File ? nextFile : null);
  }

  function resetForm() {
    setFile(null);
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
          <Heading level={2}>문서 업로드</Heading>
          <Text type="supporting" display="block">
            견적서, 제안서, 계약서, 회의록 파일을 프로젝트에 추가합니다.
          </Text>
        </div>

        <FileInput
          label="문서 파일"
          value={file}
          mode="dropzone"
          placeholder="파일을 선택하거나 여기에 끌어다 놓으세요."
          description="현재 MVP는 한 번에 하나의 파일을 업로드합니다."
          isRequired
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          onChange={handleFileChange}
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
            label="업로드"
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

function toUploadDocumentErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400 || error.status === 422) {
      return "업로드할 수 없는 파일입니다. 파일 형식과 내용을 확인해주세요.";
    }

    if (error.status === 404) {
      return "프로젝트를 찾을 수 없습니다.";
    }

    if (error.status === 409) {
      return "현재 문서 상태에서는 업로드를 진행할 수 없습니다.";
    }

    if (error.status === 413) {
      return "파일 크기가 너무 큽니다.";
    }

    return `서버가 ${error.status} 응답을 반환했습니다.`;
  }

  if (error instanceof TypeError) {
    return "백엔드 서버에 연결할 수 없습니다.";
  }

  return "문서를 업로드하지 못했습니다.";
}
