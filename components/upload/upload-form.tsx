"use client";

import UploadFormInput from "@/components/upload/upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "react-toastify";
import "@/components/upload/upload-toast.css";
import { z } from "zod";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const [summary, setSummary] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      toast.dismiss();
      toast.success("Upload completed successfully!", {
        className: "Toastify__toast--success",
        progressClassName: "Toastify__progress-bar",
      });
      console.log("uploaded successfully!");
    },
    onUploadError: (err) => {
      toast.dismiss();
      console.error("error occurred while uploading", err);
      toast.error("Error occurred while uploading. Please try again.", {
        className: "Toastify__toast--error",
        progressClassName: "Toastify__progress-bar",
      });
    },
    onUploadBegin: (file) => {
      toast.loading("📄 Uploading PDF...", {
        className: "Toastify__toast--info",
        progressClassName: "Toastify__progress-bar",
      });
      console.log("upload has begun for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      // Validate fields
      const validatedFields = schema.safeParse({ file });

      if (!validatedFields.success) {
        toast.dismiss();
        toast.error("Invalid file. Please upload a PDF less than 20MB.", {
          className: "Toastify__toast--error",
          progressClassName: "Toastify__progress-bar",
        });
        setIsLoading(false);
        return;
      }

      const resp = await startUpload([file]);
      console.log("Upload response:", resp);
      if (!resp || resp.length === 0) {
        toast.dismiss();
        toast.error("Something went wrong, please use a different file.", {
          className: "Toastify__toast--error",
          progressClassName: "Toastify__progress-bar",
        });
        setIsLoading(false);
        return;
      }

      toast.dismiss();
      toast.loading("📄 Processing PDF...", {
        className: "Toastify__toast--info",
        progressClassName: "Toastify__progress-bar",
      });

      const formattedResp = resp.map((item) => ({
        serverData: {
          userId: "user_2xs9zaJLgEJJEew2zRJGpTp3zky", // placeholder userId, replace with actual user context if available
          file: {
            ufsUrl: item.ufsUrl || item.url || item.appUrl || item.key,
            name: item.name,
          },
        },
      }));

      let summaryResponse;
      let storeResult: any;

      try {
        summaryResponse = await generatePdfSummary([formattedResp[0]]);
        console.log({ summaryResponse });

        const { data = null, message = null } = summaryResponse || {};

        if (data) {
          toast.dismiss();
          toast.success("Saving PDF...", {
            className: "Toastify__toast--success",
            progressClassName: "Toastify__progress-bar",
          });

          if (data.summary) {
            storeResult = await storePdfSummaryAction({
              userId: formattedResp[0].serverData.userId,
              summary: data.summary,
              fileUrl: formattedResp[0].serverData.file.ufsUrl,
              title: data.title,
              fileName: file.name,
            });
          }

          if (summaryResponse && summaryResponse.success) {
            setSummary(summaryResponse.data?.summary || null);
            toast.dismiss();
            toast.success("Summary generated successfully!", {
              className: "Toastify__toast--success",
              progressClassName: "Toastify__progress-bar",
            });

            formRef.current?.reset();
            router.push(`/summaries/${storeResult.data.id}`);
          } else if (summaryResponse && !summaryResponse.success) {
            toast.dismiss();
            if (
              message ===
              "Summary generation failed due to API rate limits. Please try again later."
            ) {
              toast.error(
                "API rate limit exceeded. Please wait and try again later.",
                {
                  className: "Toastify__toast--error",
                  progressClassName: "Toastify__progress-bar",
                }
              );
            } else {
              toast.error(`Failed to generate summary: ${message}`, {
                className: "Toastify__toast--error",
                progressClassName: "Toastify__progress-bar",
              });
            }
            setIsLoading(false);
            formRef.current?.reset();
          } else {
            toast.dismiss();
            toast.error("Failed to generate summary. Please try again.", {
              className: "Toastify__toast--error",
              progressClassName: "Toastify__progress-bar",
            });
            setIsLoading(false);
            formRef.current?.reset();
          }
        } else {
          toast.dismiss();
          toast.error("Failed to generate summary. Please try again.", {
            className: "Toastify__toast--error",
            progressClassName: "Toastify__progress-bar",
          });
          setIsLoading(false);
          formRef.current?.reset();
        }
      } catch (error) {
        toast.dismiss();
        console.error("Error during PDF summary generation or storage", error);
        toast.error(
          "An error occurred while processing the PDF. Please try again.",
          {
            className: "Toastify__toast--error",
            progressClassName: "Toastify__progress-bar",
          }
        );
        setIsLoading(false);
        formRef.current?.reset();
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error occurred", error);
      toast.dismiss();
      toast.error("An unexpected error occurred. Please try again.", {
        className: "Toastify__toast--error",
        progressClassName: "Toastify__progress-bar",
      });
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full mt-6 border-t border-gray-200 dark:border-gray-800 ">
            
              <span className="bg-background px-3 text-muted-foreground text-sm">
                Upload PDF
              </span>
              
          </div>
        </div>
      </div>
      <UploadFormInput isLoading={isLoading} onSubmit={handleSubmit} />
      {isLoading && (
        <>
          <div className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-muted-foreground text-sm">
                Processing
              </span>
            </div>
          </div>
          <LoadingSkeleton />
        </>
      )}
    </div>
  );
}
