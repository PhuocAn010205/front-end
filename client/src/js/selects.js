 const selectMenus = document.querySelectorAll(".select-menu");
        selectMenus.forEach((menu) => {
            const select = menu.querySelector(".select");
            const optionList = menu.querySelector(".option-list");
            const options = menu.querySelectorAll(".option");

            select.addEventListener("click", () => {
                optionList.classList.toggle("active");
                select.querySelector(".fa-angle-down").classList.toggle("fa-angle-up");
            });

            options.forEach((option) => {
                option.addEventListener("click", () => {
                    options.forEach((opt) => opt.classList.remove("selected"));
                    select.querySelector("span").innerHTML = option.innerHTML;
                    option.classList.add("selected");
                    optionList.classList.remove("active");
                    select.querySelector(".fa-angle-down").classList.remove("fa-angle-up");
                    filterMarkers(); // Gọi hàm lọc khi chọn option
                });
            });
        });
