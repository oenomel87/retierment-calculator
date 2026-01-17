/**
 * 퇴직금 계산기 - UI 렌더러
 */

// 직원 데이터 저장소
let employees = [];
let editingEmployeeId = null;

// DOM 요소
const employeeTableBody = document.getElementById('employeeTableBody');
const employeeTable = document.getElementById('employeeTable');
const emptyMessage = document.getElementById('emptyMessage');
const employeeModal = document.getElementById('employeeModal');
const modalTitle = document.getElementById('modalTitle');

// 버튼
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const deleteEmployeeBtn = document.getElementById('deleteEmployeeBtn');
const calculateAllBtn = document.getElementById('calculateAllBtn');
const addExampleBtn = document.getElementById('addExampleBtn');
const exportExcelBtn = document.getElementById('exportExcelBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const saveEmployeeBtn = document.getElementById('saveEmployeeBtn');
const calcPeriodsBtn = document.getElementById('calcPeriodsBtn');
const addNonCalcBtn = document.getElementById('addNonCalcBtn');
const addExclusionBtn = document.getElementById('addExclusionBtn');
const selectAll = document.getElementById('selectAll');

// 이벤트 바인딩
addEmployeeBtn.addEventListener('click', () => openModal());
deleteEmployeeBtn.addEventListener('click', deleteSelectedEmployees);
calculateAllBtn.addEventListener('click', calculateAllEmployees);
addExampleBtn.addEventListener('click', addExampleData);
exportExcelBtn.addEventListener('click', exportToExcel);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
saveEmployeeBtn.addEventListener('click', saveEmployee);
calcPeriodsBtn.addEventListener('click', calculatePeriods);
addNonCalcBtn.addEventListener('click', () => addPeriodRow('nonCalcPeriods'));
addExclusionBtn.addEventListener('click', () => addPeriodRow('exclusionPeriods'));
selectAll.addEventListener('change', toggleSelectAll);

// 모달 외부 클릭 시 닫기
employeeModal.addEventListener('click', (e) => {
    if (e.target === employeeModal) closeModal();
});

/**
 * 테이블 렌더링
 */
function renderTable() {
    employeeTableBody.innerHTML = '';

    if (employees.length === 0) {
        employeeTable.classList.add('hidden');
        emptyMessage.classList.add('show');
    } else {
        employeeTable.classList.remove('hidden');
        emptyMessage.classList.remove('show');

        employees.forEach((emp, index) => {
            const tr = document.createElement('tr');
            const isCalculated = emp.severancePay > 0;

            tr.innerHTML = `
        <td class="col-checkbox">
          <input type="checkbox" data-id="${emp.id}">
        </td>
        <td class="col-name">${escapeHtml(emp.name)}</td>
        <td class="col-date">${emp.hireDate}</td>
        <td class="col-date">${emp.retireDate}</td>
        <td class="col-num">${isCalculated ? formatNumber(emp.workDays) : '-'}</td>
        <td class="col-money">${isCalculated ? formatNumber(emp.dailyAvgPay) + '원' : '-'}</td>
        <td class="col-money">${isCalculated ? formatNumber(emp.severancePay) + '원' : '-'}</td>
        <td class="col-status">
          <span class="${isCalculated ? 'status-calculated' : 'status-pending'}">
            ${isCalculated ? '계산완료' : '미계산'}
          </span>
        </td>
        <td class="col-action">
          <button class="edit-btn" data-id="${emp.id}">편집</button>
        </td>
      `;

            employeeTableBody.appendChild(tr);
        });

        // 편집 버튼 이벤트
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                openModal(id);
            });
        });
    }

    updateSummary();
}

/**
 * 요약 정보 업데이트
 */
function updateSummary() {
    const total = employees.length;
    const calculated = employees.filter(e => e.severancePay > 0).length;
    const totalSeverance = employees.reduce((sum, e) => sum + (e.severancePay || 0), 0);

    document.getElementById('totalCount').textContent = `${total}명`;
    document.getElementById('calculatedCount').textContent = `${calculated}명`;
    document.getElementById('totalSeverance').textContent = `${formatNumber(totalSeverance)}원`;
}

/**
 * 모달 열기
 */
function openModal(employeeId = null) {
    editingEmployeeId = employeeId;

    if (employeeId) {
        modalTitle.textContent = '직원 정보 편집';
        const emp = employees.find(e => e.id === employeeId);
        if (emp) {
            loadEmployeeToForm(emp);
        }
    } else {
        modalTitle.textContent = '직원 추가';
        clearForm();
    }

    employeeModal.classList.add('show');
}

/**
 * 모달 닫기
 */
function closeModal() {
    employeeModal.classList.remove('show');
    editingEmployeeId = null;
    clearForm();
}

/**
 * 폼 초기화
 */
function clearForm() {
    document.getElementById('empName').value = '';
    document.getElementById('empHireDate').value = '';
    document.getElementById('empRetireDate').value = '';
    document.getElementById('empAnnualBonus').value = '';
    document.getElementById('empVacationPay').value = '';
    document.getElementById('empOrdinaryPay').value = '';
    document.getElementById('salaryPeriods').innerHTML = '';
    document.getElementById('nonCalcPeriods').innerHTML = '';
    document.getElementById('exclusionPeriods').innerHTML = '';
}

/**
 * 직원 데이터를 폼에 로드
 */
function loadEmployeeToForm(emp) {
    document.getElementById('empName').value = emp.name;
    document.getElementById('empHireDate').value = emp.hireDate;
    document.getElementById('empRetireDate').value = emp.retireDate;
    document.getElementById('empAnnualBonus').value = formatNumber(emp.annualBonus);
    document.getElementById('empVacationPay').value = formatNumber(emp.vacationPay);
    document.getElementById('empOrdinaryPay').value = formatNumber(emp.dailyOrdinaryPay);

    // 급여 기간
    renderSalaryPeriods(emp.salaryPeriods);

    // 미산입기간
    const nonCalcContainer = document.getElementById('nonCalcPeriods');
    nonCalcContainer.innerHTML = '';
    (emp.nonCalcPeriods || []).forEach(p => {
        addPeriodRow('nonCalcPeriods', p.start, p.end);
    });

    // 근무제외기간
    const exclusionContainer = document.getElementById('exclusionPeriods');
    exclusionContainer.innerHTML = '';
    (emp.exclusionPeriods || []).forEach(p => {
        addPeriodRow('exclusionPeriods', p.start, p.end);
    });
}

/**
 * 급여 기간 렌더링
 */
function renderSalaryPeriods(periods) {
    const container = document.getElementById('salaryPeriods');
    container.innerHTML = '';

    periods.forEach((period, index) => {
        const row = document.createElement('div');
        row.className = 'salary-period-row';
        row.innerHTML = `
      <span class="period-label">기간${index + 1}</span>
      <span class="period-dates">${formatDateDisplay(period.startDate)}~${formatDateDisplay(period.endDate)}</span>
      <span class="period-days">(${period.days}일)</span>
      <input type="text" class="salary-basic" data-index="${index}" 
             placeholder="기본급" value="${formatNumber(period.basicSalary)}">
      <span>원</span>
      <input type="text" class="salary-other" data-index="${index}" 
             placeholder="기타수당" value="${formatNumber(period.otherPay)}">
      <span>원</span>
    `;
        container.appendChild(row);
    });
}

/**
 * 기간 자동 계산
 */
function calculatePeriods() {
    const retireDate = document.getElementById('empRetireDate').value;
    if (!retireDate) {
        alert('퇴직일을 먼저 입력하세요.');
        return;
    }

    const periods = calculate3MonthPeriods(retireDate);
    renderSalaryPeriods(periods);
}

/**
 * 기간 행 추가
 */
function addPeriodRow(containerId, startDate = '', endDate = '') {
    const container = document.getElementById(containerId);
    const row = document.createElement('div');
    row.className = 'period-row';
    row.innerHTML = `
    <input type="date" class="period-start" value="${startDate}">
    <span class="separator">~</span>
    <input type="date" class="period-end" value="${endDate}">
    <button class="delete-period-btn">삭제</button>
  `;

    row.querySelector('.delete-period-btn').addEventListener('click', () => {
        row.remove();
    });

    container.appendChild(row);
}

/**
 * 직원 저장
 */
function saveEmployee() {
    const name = document.getElementById('empName').value.trim();
    const hireDate = document.getElementById('empHireDate').value;
    const retireDate = document.getElementById('empRetireDate').value;

    // 유효성 검사
    if (!name) {
        alert('이름을 입력하세요.');
        return;
    }
    if (!hireDate) {
        alert('입사일을 입력하세요.');
        return;
    }
    if (!retireDate) {
        alert('퇴직일을 입력하세요.');
        return;
    }
    if (new Date(hireDate) >= new Date(retireDate)) {
        alert('퇴직일은 입사일 이후여야 합니다.');
        return;
    }

    // 급여 기간 수집
    const salaryPeriods = [];
    const container = document.getElementById('salaryPeriods');
    const rows = container.querySelectorAll('.salary-period-row');

    if (rows.length === 0) {
        alert('퇴직일을 입력한 후 [기간 자동계산] 버튼을 클릭하세요.');
        return;
    }

    rows.forEach((row, index) => {
        const dateText = row.querySelector('.period-dates').textContent;
        const daysText = row.querySelector('.period-days').textContent;
        const days = parseInt(daysText.match(/\d+/)[0]);
        const basicInput = row.querySelector('.salary-basic');
        const otherInput = row.querySelector('.salary-other');

        // 기존 editingEmployeeId가 있으면 해당 직원의 salaryPeriods에서 날짜 가져오기
        let startDate, endDate;
        if (editingEmployeeId) {
            const emp = employees.find(e => e.id === editingEmployeeId);
            if (emp && emp.salaryPeriods[index]) {
                startDate = emp.salaryPeriods[index].startDate;
                endDate = emp.salaryPeriods[index].endDate;
            }
        }

        // 날짜가 없으면 다시 계산
        if (!startDate || !endDate) {
            const periods = calculate3MonthPeriods(retireDate);
            if (periods[index]) {
                startDate = periods[index].startDate;
                endDate = periods[index].endDate;
            }
        }

        salaryPeriods.push({
            startDate: startDate,
            endDate: endDate,
            days: days,
            basicSalary: parseNumber(basicInput.value),
            otherPay: parseNumber(otherInput.value)
        });
    });

    // 미산입기간 수집
    const nonCalcPeriods = [];
    document.querySelectorAll('#nonCalcPeriods .period-row').forEach(row => {
        const start = row.querySelector('.period-start').value;
        const end = row.querySelector('.period-end').value;
        if (start && end) {
            nonCalcPeriods.push({ start, end });
        }
    });

    // 근무제외기간 수집
    const exclusionPeriods = [];
    document.querySelectorAll('#exclusionPeriods .period-row').forEach(row => {
        const start = row.querySelector('.period-start').value;
        const end = row.querySelector('.period-end').value;
        if (start && end) {
            exclusionPeriods.push({ start, end });
        }
    });

    const employeeData = {
        id: editingEmployeeId || Date.now(),
        name,
        hireDate,
        retireDate,
        salaryPeriods,
        annualBonus: parseNumber(document.getElementById('empAnnualBonus').value),
        vacationPay: parseNumber(document.getElementById('empVacationPay').value),
        dailyOrdinaryPay: parseNumber(document.getElementById('empOrdinaryPay').value),
        nonCalcPeriods,
        exclusionPeriods,
        workDays: 0,
        totalDays3Month: 0,
        totalSalary: 0,
        dailyAvgPay: 0,
        severancePay: 0,
        note: ''
    };

    if (editingEmployeeId) {
        // 기존 직원 수정
        const index = employees.findIndex(e => e.id === editingEmployeeId);
        if (index !== -1) {
            employees[index] = employeeData;
        }
    } else {
        // 새 직원 추가
        employees.push(employeeData);
    }

    closeModal();
    renderTable();
}

/**
 * 선택된 직원 삭제
 */
function deleteSelectedEmployees() {
    const checkboxes = document.querySelectorAll('#employeeTableBody input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        alert('삭제할 직원을 선택하세요.');
        return;
    }

    if (!confirm(`${checkboxes.length}명의 직원을 삭제하시겠습니까?`)) {
        return;
    }

    const idsToDelete = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
    employees = employees.filter(e => !idsToDelete.includes(e.id));

    renderTable();
}

/**
 * 전체 선택 토글
 */
function toggleSelectAll() {
    const checked = selectAll.checked;
    document.querySelectorAll('#employeeTableBody input[type="checkbox"]').forEach(cb => {
        cb.checked = checked;
    });
}

/**
 * 전체 계산
 */
function calculateAllEmployees() {
    if (employees.length === 0) {
        alert('계산할 직원이 없습니다.');
        return;
    }

    let errors = [];

    employees.forEach((emp, index) => {
        const result = calculateSeverance(emp);

        if (result.success) {
            employees[index] = {
                ...emp,
                workDays: result.workDays,
                totalDays3Month: result.totalDays3Month,
                totalSalary: result.totalSalary,
                dailyAvgPay: result.dailyAvgPay,
                severancePay: result.severancePay,
                note: result.note
            };
        } else {
            errors.push(`${emp.name}: ${result.error}`);
        }
    });

    renderTable();

    if (errors.length > 0) {
        alert('일부 직원의 계산에 실패했습니다:\n\n' + errors.join('\n'));
    } else {
        alert(`${employees.length}명의 퇴직금 계산이 완료되었습니다.`);
    }
}

/**
 * 예제 데이터 추가
 */
function addExampleData() {
    const example = createExampleEmployee();
    employees.push(example);
    renderTable();
    alert('고용노동부 예시 데이터가 추가되었습니다.\n\n예상 1일 평균임금: 약 88,641원\n\n[전체 계산] 버튼을 눌러 결과를 확인하세요.');
}

/**
 * 엑셀 내보내기
 */
async function exportToExcel() {
    if (employees.length === 0) {
        alert('내보낼 데이터가 없습니다.');
        return;
    }

    const uncalculated = employees.filter(e => e.severancePay === 0);
    if (uncalculated.length > 0) {
        if (!confirm(`${uncalculated.length}명의 퇴직금이 계산되지 않았습니다.\n그래도 내보내시겠습니까?`)) {
            return;
        }
    }

    try {
        const result = await window.go.main.App.ExportExcel({ employees });

        if (result.success) {
            alert(`파일이 저장되었습니다:\n${result.filePath}`);
        } else if (result.message !== '취소됨') {
            alert(`저장 실패: ${result.message}`);
        }
    } catch (e) {
        alert(`오류 발생: ${e.message}`);
    }
}

/**
 * HTML 이스케이프
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 초기 렌더링
renderTable();
