import "@styles/navbar.scss";
import "@styles/user-settings.scss";
import "@styles/input-block.scss";

{
  const image = document.getElementById("image");
  const avatar = document.getElementById("avatar");
  const changePhoto = document.getElementById("changePhoto");

  changePhoto.addEventListener("click", () => {
    avatar.click();
  });

  avatar.addEventListener("change", () => {
    if (avatar.files.length > 0) {
      image.src = URL.createObjectURL(avatar.files[0]);
    }
  });
}
