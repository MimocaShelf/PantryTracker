function addItemDataValidation (pantry_id, item_name, extra_info, quantity, unit) {
    if (item_name == null) {return false};
    if (pantry_id == null) {return false};
    if (pantry_id < 0) {return false};
    if (unit == null) {return false};
    if (quantity < 0) {return false};
    return true;
}


export {addItemDataValidation }