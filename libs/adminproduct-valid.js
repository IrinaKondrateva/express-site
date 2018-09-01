module.exports = (name, price, photoName, size) => {
  let response;

  if (name === '') {
    response = {
      message: 'Не указано название товара!',
      success: false
    };
  }

  if (price === '') {
    response = {
      message: 'Не указана цена товара!',
      success: false
    };
  }

  if (photoName === '' || size === 0) {
    response = {
      message: 'Не загружено изображение товара!',
      success: false
    };
  }

  return response;
};
