const HolidaysInKyrgyzstan = [
	"January 1, 2024",
	"January 2, 2024",
	"January 3, 2024",
	"January 4, 2024",
	"January 5, 2024",
	"January 27, 2024",
	"February 23, 2024",
	"March 2, 2024",
	"March 8, 2024",
	"March 21, 2024",
	"March 22, 2024",
	"April 7, 2024",
	"April 10, 2024",
	"May 1, 2024",
	"May 2, 2024",
	"May 3, 2024",
	"May 5, 2024",
	"May 9, 2024",
	"June 16, 2024",
	"June 17, 2024",
	"August 31, 2024",
	"November 7, 2024",
	"November 8, 2024",
];

const HolidaysInTajikistan = [
	"January 1, 2024",
	"March 8, 2024",
	"March 21, 2024",
	"March 22, 2024",
	"March 23, 2024",
	"March 24, 2024",
	"March 25, 2024",
	"March 26, 2024",
	"April 10, 2024",
	"May 9, 2024",
	"June 16, 2024",
	"June 17, 2024",
	"June 27, 2024",
	"September 9, 2024",
	"November 6, 2024",
];

const cityToCountryMapping = {
	Dushanbe: "Tajikistan",
	Khujand: "Tajikistan",
	Khorog: "Tajikistan",
	Bishkek: "Kyrgyzstan",
	// Add more city-country mappings as needed
};

function getCountryForCity(city) {
	return cityToCountryMapping[city] || "Unknown";
}

export function getWeekOfDay(index, year, month, city) {
	if (index > 0) {
		const date = new Date(year, month - 1, index);
		const dayOfWeek = date.getDay();
		const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
		const country = getCountryForCity(city);
		let isHoliday = false;
		if (country === "Tajikistan") {
			isHoliday = HolidaysInTajikistan.includes(
				`${date.toLocaleString("default", {
					month: "long",
				})} ${index}, ${year}`
			);
		} else if (country === "Kyrgyzstan") {
			isHoliday = HolidaysInKyrgyzstan.includes(
				`${date.toLocaleString("default", {
					month: "long",
				})} ${index}, ${year}`
			);
		}

		if (isHoliday || isWeekend) {
			return "text-[14px] bg-red-500 text-white";
		} else {
			return "text-[14px] bg-white";
		}
	} else {
		return "text-[14px] bg-white";
	}
}
