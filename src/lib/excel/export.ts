import type { Registration } from "@/types";
import ExcelJS from "exceljs";

export async function exportRegistrationsToExcel(
  registrations: Registration[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Registrations");

  sheet.columns = [
    { header: "Timestamp", key: "created_at", width: 22 },
    { header: "Registration ID", key: "registration_id", width: 18 },
    { header: "Name", key: "name", width: 25 },
    { header: "Instagram", key: "instagram", width: 20 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Gender", key: "gender", width: 10 },
    { header: "People", key: "people_count", width: 10 },
    { header: "Amount", key: "amount", width: 12 },
    { header: "Payment Status", key: "payment_status", width: 16 },
    { header: "Verification", key: "verification_status", width: 16 },
    { header: "Screenshot", key: "screenshot_url", width: 40 },
  ];

  registrations.forEach((reg) => {
    sheet.addRow({
      ...reg,
      screenshot_url: reg.screenshot_url
        ? reg.screenshot_url.split("/").pop()
        : "",
    });
  });

  sheet.getRow(1).font = { bold: true };
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export function getExportFilename(): string {
  const date = new Date().toISOString().split("T")[0];
  return `SNRLED_Registrations_${date}.xlsx`;
}
