# Call this file to view number of controller files. ./storage/private/shell-scripts/count_controllers.sh
# Search @UseGuards(AuthGuard) in "VSCode Search" to view number the number of file that AuthGuard was added.
# AuthGuard() should have in every controller to auth every routes. So, the number of controller must be equal.

#!/bin/bash

# Array of folders to ignore,
# EX. ("folder1" "folder2" "folder3")
ignore_folders=("route")

# Construct the grep exclude parameter
exclude_param=()
for folder in "${ignore_folders[@]}"; do
    exclude_param+=("--exclude-dir=$folder")
done

# Count the number of controllers in the src/ folder, excluding specified folders
controller_count=$(grep -r --include="*.controller.ts" "${exclude_param[@]}" "@Controller" src/ | wc -l)

echo "Number of Controllers: $controller_count"
