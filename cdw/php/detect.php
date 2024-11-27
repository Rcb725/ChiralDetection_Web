<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    $maxFileSize = 10 * 1024 * 1024;
    $allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK)
    {
        $file = $_FILES['image'];
        $fileType = mime_content_type($file['tmp_name']);
        if (!in_array($fileType, $allowedTypes))
        {
            echo "只允许上传 JPG, JPEG, PNG 格式的图片";
            exit;
        }
        if ($file['size'] > $maxFileSize)
        {
            echo "文件大小不能超过 10MB";
            exit;
        }
        $uploadDirectory = '../val/';
        if (!file_exists($uploadDirectory))
            mkdir($uploadDirectory, 0777, true);
        $fileName = uniqid('image_', true) . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
        $filePath = $uploadDirectory . $fileName;
        if (move_uploaded_file($file['tmp_name'], $filePath))
        {// python接口
            shell_exec("python C:\\phpstudy_pro\\WWW\\cdw\\py\\detect.py --img_file C:\\phpstudy_pro\\WWW\\cdw\\val\\$fileName --out_file C:\\phpstudy_pro\\WWW\\cdw\\valout\\det_out$fileName");
            //unlink($filePath);
            echo json_encode(['imgPath' => "/valout/det_out$fileName"]);
        }
        else
            echo "alert('上传失败，请重试')";
    }
    else
        echo "alert('没有文件上传或上传发生错误')";
?>
