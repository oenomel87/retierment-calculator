/**
 * 퇴직금 계산 로직 (고용노동부 기준)
 */

/**
 * 두 날짜 사이의 일수 계산
 */
function daysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 해당 월의 일수 반환
 */
function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

/**
 * 윤년 여부
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * 숫자 포맷 (천단위 콤마)
 */
function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return Math.round(num).toLocaleString('ko-KR');
}

/**
 * 문자열에서 숫자만 추출
 */
function parseNumber(str) {
    if (!str) return 0;
    return parseInt(str.toString().replace(/[^0-9-]/g, ''), 10) || 0;
}

/**
 * 퇴직일 기준 3개월 평균임금 산정기간 계산
 */
function calculate3MonthPeriods(retireDate) {
    const retire = new Date(retireDate);
    const year = retire.getFullYear();
    const month = retire.getMonth() + 1; // 1-12
    const day = retire.getDate();

    const periods = [];

    if (day === 1) {
        // 퇴직일이 1일인 경우: 전월부터 3개월
        for (let i = 3; i >= 1; i--) {
            let m = month - i;
            let y = year;
            if (m <= 0) {
                m += 12;
                y -= 1;
            }
            const startDate = new Date(y, m - 1, 1);
            const endDate = new Date(y, m, 0); // 해당 월 말일
            const days = daysInMonth(y, m);
            periods.push({
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                days: days,
                basicSalary: 0,
                otherPay: 0
            });
        }
    } else {
        // 퇴직일이 1일이 아닌 경우: 4개 기간

        // 기간1: 3개월 전 해당일부터 말일까지
        let m1 = month - 3;
        let y1 = year;
        if (m1 <= 0) {
            m1 += 12;
            y1 -= 1;
        }
        let startDay = day;
        const maxDay1 = daysInMonth(y1, m1);
        if (startDay > maxDay1) startDay = maxDay1;

        const period1Start = new Date(y1, m1 - 1, startDay);
        const period1End = new Date(y1, m1, 0);
        const period1Days = daysBetween(period1Start, period1End) + 1;

        periods.push({
            startDate: formatDate(period1Start),
            endDate: formatDate(period1End),
            days: period1Days,
            basicSalary: 0,
            otherPay: 0
        });

        // 기간2: 전전월 전체
        let m2 = month - 2;
        let y2 = year;
        if (m2 <= 0) {
            m2 += 12;
            y2 -= 1;
        }
        const period2Start = new Date(y2, m2 - 1, 1);
        const period2End = new Date(y2, m2, 0);

        periods.push({
            startDate: formatDate(period2Start),
            endDate: formatDate(period2End),
            days: daysInMonth(y2, m2),
            basicSalary: 0,
            otherPay: 0
        });

        // 기간3: 전월 전체
        let m3 = month - 1;
        let y3 = year;
        if (m3 <= 0) {
            m3 += 12;
            y3 -= 1;
        }
        const period3Start = new Date(y3, m3 - 1, 1);
        const period3End = new Date(y3, m3, 0);

        periods.push({
            startDate: formatDate(period3Start),
            endDate: formatDate(period3End),
            days: daysInMonth(y3, m3),
            basicSalary: 0,
            otherPay: 0
        });

        // 기간4: 당월 1일부터 퇴직 전날까지
        const period4Start = new Date(year, month - 1, 1);
        const period4End = new Date(retire.getTime() - 24 * 60 * 60 * 1000); // 퇴직 전날
        const period4Days = day - 1;

        if (period4Days > 0) {
            periods.push({
                startDate: formatDate(period4Start),
                endDate: formatDate(period4End),
                days: period4Days,
                basicSalary: 0,
                otherPay: 0
            });
        }
    }

    return periods;
}

/**
 * Date 객체를 YYYY-MM-DD 형식으로 변환
 */
function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * 날짜를 표시용 형식으로 변환 (M.D)
 */
function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}.${date.getDate()}`;
}

/**
 * 기간 겹침 일수 계산
 */
function overlapDays(periodStart, periodEnd, excludeStart, excludeEnd) {
    const pStart = new Date(periodStart);
    const pEnd = new Date(periodEnd);
    const eStart = new Date(excludeStart);
    const eEnd = new Date(excludeEnd);

    if (eEnd < pStart || eStart > pEnd) {
        return 0;
    }

    const overlapStart = pStart > eStart ? pStart : eStart;
    const overlapEnd = pEnd < eEnd ? pEnd : eEnd;

    return daysBetween(overlapStart, overlapEnd) + 1;
}

/**
 * 근무제외기간 총 일수 계산
 */
function calculateExcludedDays(exclusionPeriods) {
    let total = 0;
    for (const period of exclusionPeriods) {
        if (period.start && period.end) {
            total += daysBetween(period.start, period.end) + 1;
        }
    }
    return total;
}

/**
 * 퇴직금 계산
 */
function calculateSeverance(employee) {
    const result = {
        success: false,
        workDays: 0,
        totalDays3Month: 0,
        adjustedDays3Month: 0,
        totalSalary: 0,
        dailyAvgPay: 0,
        severancePay: 0,
        note: '',
        error: ''
    };

    try {
        // 1. 재직일수 계산 (근무제외기간 차감)
        const baseDays = daysBetween(employee.hireDate, employee.retireDate);
        const excludedDays = calculateExcludedDays(employee.exclusionPeriods || []);
        const workDays = baseDays - excludedDays;

        if (workDays < 365) {
            result.error = '재직기간은 1년 이상이어야 합니다';
            return result;
        }

        result.workDays = workDays;

        // 2. 3개월 총 일수
        const totalDays = employee.salaryPeriods.reduce((sum, p) => sum + (p.days || 0), 0);
        result.totalDays3Month = totalDays;

        if (totalDays === 0) {
            result.error = '임금 정보가 없습니다';
            return result;
        }

        // 3. 미산입기간 적용하여 조정된 일수 계산
        let adjustedDays = totalDays;
        for (const period of employee.salaryPeriods) {
            for (const nonCalc of (employee.nonCalcPeriods || [])) {
                if (nonCalc.start && nonCalc.end) {
                    const overlap = overlapDays(period.startDate, period.endDate, nonCalc.start, nonCalc.end);
                    adjustedDays -= overlap;
                }
            }
        }
        result.adjustedDays3Month = adjustedDays > 0 ? adjustedDays : totalDays;

        // 4. 임금총액 계산
        const basicSum = employee.salaryPeriods.reduce((sum, p) => sum + parseNumber(p.basicSalary), 0);
        const otherSum = employee.salaryPeriods.reduce((sum, p) => sum + parseNumber(p.otherPay), 0);

        // 상여금/연차수당 가산액
        let bonusAddition, vacationAddition;
        if (adjustedDays !== totalDays && adjustedDays > 0) {
            // 미산입기간이 있는 경우
            bonusAddition = parseNumber(employee.annualBonus) * 0.25 * adjustedDays / totalDays;
            vacationAddition = parseNumber(employee.vacationPay) * 0.25 * adjustedDays / totalDays;
        } else {
            bonusAddition = parseNumber(employee.annualBonus) * 0.25;
            vacationAddition = parseNumber(employee.vacationPay) * 0.25;
        }

        const totalSalary = basicSum + otherSum + Math.round(bonusAddition) + Math.round(vacationAddition);
        result.totalSalary = totalSalary;

        // 5. 1일 평균임금 계산 (소수점 셋째자리에서 올림)
        const daysForCalc = result.adjustedDays3Month > 0 ? result.adjustedDays3Month : totalDays;
        let dailyAvg = totalSalary / daysForCalc;
        dailyAvg = Math.ceil(dailyAvg * 100) / 100; // 소수점 둘째자리까지, 셋째자리에서 올림
        result.dailyAvgPay = dailyAvg;

        // 6. 통상임금 비교
        const ordinaryPay = parseNumber(employee.dailyOrdinaryPay);
        let finalDailyPay = dailyAvg;
        if (ordinaryPay > 0 && ordinaryPay > dailyAvg) {
            finalDailyPay = ordinaryPay;
            result.note = '통상임금 적용';
        }

        // 7. 퇴직금 계산
        // 퇴직금 = 1일 평균임금 × 30일 × (재직일수 / 365)
        const severance = finalDailyPay * 30 * (workDays / 365);
        result.severancePay = Math.floor(severance);

        result.success = true;
        return result;

    } catch (e) {
        result.error = e.message;
        return result;
    }
}

/**
 * 예제 데이터 생성 (고용노동부 예시)
 */
function createExampleEmployee() {
    return {
        id: Date.now(),
        name: '홍길동 (예시)',
        hireDate: '2014-10-02',
        retireDate: '2017-09-16',
        salaryPeriods: [
            { startDate: '2017-06-16', endDate: '2017-06-30', days: 15, basicSalary: 1000000, otherPay: 180000 },
            { startDate: '2017-07-01', endDate: '2017-07-31', days: 31, basicSalary: 2000000, otherPay: 360000 },
            { startDate: '2017-08-01', endDate: '2017-08-31', days: 31, basicSalary: 2000000, otherPay: 360000 },
            { startDate: '2017-09-01', endDate: '2017-09-15', days: 15, basicSalary: 1000000, otherPay: 180000 }
        ],
        annualBonus: 4000000,
        vacationPay: 300000, // 60000원 × 5일
        dailyOrdinaryPay: 0,
        nonCalcPeriods: [],
        exclusionPeriods: [],
        // 계산 결과
        workDays: 0,
        totalDays3Month: 0,
        totalSalary: 0,
        dailyAvgPay: 0,
        severancePay: 0,
        note: ''
    };
}
