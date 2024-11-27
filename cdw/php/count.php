<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK)
    {
        $file = $_FILES['image'];
        $uploadDirectory = '../val/';
        if (!file_exists($uploadDirectory))
            mkdir($uploadDirectory, 0777, true);
        $fileName = uniqid('image_', true) . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
        $filePath = $uploadDirectory . $fileName;
        if (move_uploaded_file($file['tmp_name'], $filePath))
        {// python接口
            shell_exec("python C:\\phpstudy_pro\\WWW\\cdw\\py\\count.py --img_file C:\\phpstudy_pro\\WWW\\cdw\\val\\$fileName --out_file C:\\phpstudy_pro\\WWW\\cdw\\valout\\ann_out$fileName");
            //unlink($filePath);
            echo json_encode(['imgPath' => "/valout/ann_out$fileName"]);
        }
        else
            echo "alert('上传失败，请重试')";
    }
    else
        echo "alert('没有文件上传或上传发生错误')";
?>
