import dayjs from "dayjs";

export const FORMATE_DATE = "YYYY-MM-DD";
export const MAX_UPLOAD_IMAGE_SIZE = 2;

export const dateValidate = (date: any) => {
    if (!date) {
        return undefined;
    }

    const validDate = dayjs(date, FORMATE_DATE);
    if (!validDate.isValid()) {
        return undefined;
    }

    return validDate.format(FORMATE_DATE);
}