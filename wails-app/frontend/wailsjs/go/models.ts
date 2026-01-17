export namespace main {
	
	export class Employee {
	    name: string;
	    hireDate: string;
	    retireDate: string;
	    workDays: number;
	    totalDays3Month: number;
	    totalSalary: number;
	    dailyAvgPay: number;
	    dailyOrdinaryPay: number;
	    severancePay: number;
	    note: string;
	
	    static createFrom(source: any = {}) {
	        return new Employee(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.hireDate = source["hireDate"];
	        this.retireDate = source["retireDate"];
	        this.workDays = source["workDays"];
	        this.totalDays3Month = source["totalDays3Month"];
	        this.totalSalary = source["totalSalary"];
	        this.dailyAvgPay = source["dailyAvgPay"];
	        this.dailyOrdinaryPay = source["dailyOrdinaryPay"];
	        this.severancePay = source["severancePay"];
	        this.note = source["note"];
	    }
	}
	export class ExportPayload {
	    employees: Employee[];
	
	    static createFrom(source: any = {}) {
	        return new ExportPayload(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.employees = this.convertValues(source["employees"], Employee);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ExportResult {
	    success: boolean;
	    filePath?: string;
	    message?: string;
	
	    static createFrom(source: any = {}) {
	        return new ExportResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.filePath = source["filePath"];
	        this.message = source["message"];
	    }
	}

}

