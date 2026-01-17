package main

import (
    "context"
    "fmt"
    "math"

    "github.com/wailsapp/wails/v2/pkg/runtime"
    "github.com/xuri/excelize/v2"
)

type App struct {
    ctx context.Context
}

func NewApp() *App {
    return &App{}
}

func (a *App) startup(ctx context.Context) {
    a.ctx = ctx
}

type ExportPayload struct {
    Employees []Employee `json:"employees"`
}

type Employee struct {
    Name             string  `json:"name"`
    HireDate         string  `json:"hireDate"`
    RetireDate       string  `json:"retireDate"`
    WorkDays         float64 `json:"workDays"`
    TotalDays3Month  float64 `json:"totalDays3Month"`
    TotalSalary      float64 `json:"totalSalary"`
    DailyAvgPay      float64 `json:"dailyAvgPay"`
    DailyOrdinaryPay float64 `json:"dailyOrdinaryPay"`
    SeverancePay     float64 `json:"severancePay"`
    Note             string  `json:"note"`
}

type ExportResult struct {
    Success  bool   `json:"success"`
    FilePath string `json:"filePath,omitempty"`
    Message  string `json:"message,omitempty"`
}

func (a *App) ExportExcel(payload ExportPayload) (ExportResult, error) {
    if a.ctx == nil {
        return ExportResult{Success: false, Message: "앱 초기화에 실패했습니다."}, nil
    }

    path, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
        Title:           "결과 저장",
        DefaultFilename: "퇴직금계산결과.xlsx",
        Filters: []runtime.FileFilter{
            {
                DisplayName: "Excel Files (*.xlsx)",
                Pattern:     "*.xlsx",
            },
        },
    })
    if err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }
    if path == "" {
        return ExportResult{Success: false, Message: "취소됨"}, nil
    }

    file := excelize.NewFile()
    defer file.Close()

    sheetName := "퇴직금 계산 결과"
    sheetIndex, err := file.NewSheet(sheetName)
    if err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }
    _ = file.DeleteSheet("Sheet1")
    file.SetActiveSheet(sheetIndex)

    headers := []interface{}{
        "이름", "입사일", "퇴직일", "재직일수",
        "3개월 총일수", "임금총액", "1일 평균임금",
        "1일 통상임금", "퇴직금", "비고",
    }
    if err := file.SetSheetRow(sheetName, "A1", &headers); err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }

    rowIndex := 2
    totalSeverance := 0.0
    for _, emp := range payload.Employees {
        dailyAvgPay := math.Round(emp.DailyAvgPay*100) / 100
        row := []interface{}{
            emp.Name,
            emp.HireDate,
            emp.RetireDate,
            emp.WorkDays,
            emp.TotalDays3Month,
            emp.TotalSalary,
            dailyAvgPay,
            emp.DailyOrdinaryPay,
            emp.SeverancePay,
            emp.Note,
        }
        cell := fmt.Sprintf("A%d", rowIndex)
        if err := file.SetSheetRow(sheetName, cell, &row); err != nil {
            return ExportResult{Success: false, Message: err.Error()}, nil
        }
        totalSeverance += emp.SeverancePay
        rowIndex++
    }

    totalRow := []interface{}{"합계", "", "", "", "", "", "", "", totalSeverance, ""}
    if err := file.SetSheetRow(sheetName, fmt.Sprintf("A%d", rowIndex), &totalRow); err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }

    if err := file.SetColWidth(sheetName, "A", "A", 12); err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }
    if err := file.SetColWidth(sheetName, "B", "B", 12); err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }
    if err := file.SetColWidth(sheetName, "C", "C", 12); err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }
    if err := file.SetColWidth(sheetName, "D", "D", 10); err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }
    if err := file.SetColWidth(sheetName, "E", "E", 12); err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }
    if err := file.SetColWidth(sheetName, "F", "F", 15); err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }
    if err := file.SetColWidth(sheetName, "G", "G", 15); err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }
    if err := file.SetColWidth(sheetName, "H", "H", 15); err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }
    if err := file.SetColWidth(sheetName, "I", "I", 15); err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }
    if err := file.SetColWidth(sheetName, "J", "J", 15); err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }

    if err := file.SaveAs(path); err != nil {
        return ExportResult{Success: false, Message: err.Error()}, nil
    }

    return ExportResult{Success: true, FilePath: path}, nil
}
