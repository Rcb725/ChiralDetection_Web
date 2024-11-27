import argparse
from PIL import Image, ImageDraw, ImageFont

def add_text_to_image(img_path, out_path, text):
    image = Image.open(img_path)

    # 创建一个可以在上面绘图的对象
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype("C:\\Windows\\Fonts\\timesbd.ttf", 250)
    
    #文本
    text="ana"
    
    # 使用 textbbox 计算文本的宽度和高度
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # 获取图像的宽度和高度
    width, height = image.size

    #高度比例,轮廓颜色,轮廓宽度
    h=6
    outline='red'
    outlinewidth=15

    # 轮廓
    position = ((width - text_width) / 2+outlinewidth, (height - text_height) / h)
    draw.text(position, text, font=font, fill=outline)
    position = ((width - text_width) / 2-outlinewidth, (height - text_height) / h)
    draw.text(position, text, font=font, fill=outline)
    position = ((width - text_width) / 2, (height - text_height) / h+outlinewidth)
    draw.text(position, text, font=font, fill=outline)
    position = ((width - text_width) / 2, (height - text_height) / h-outlinewidth)
    draw.text(position, text, font=font, fill=outline)
    
    # 填充
    position = ((width - text_width) / 2, (height - text_height) / h)
    draw.text(position, text, font=font, fill="yellow")

    try:
        # 保存结果图片
        print(f"保存结果图片到：{out_path}")
        image.save(out_path)
        print(f"图片已保存到：{out_path}")
    except Exception as e:
        print(f"保存图片时发生错误: {e}")

def main():
    # 解析命令行参数
    parser = argparse.ArgumentParser(description="在图片中央添加文本")
    parser.add_argument('--img_file', required=True, help="输入图片文件路径")
    parser.add_argument('--out_file', required=True, help="输出图片文件路径")
    args = parser.parse_args()

    # 打印输入的文件路径，检查是否正确
    print(f"输入文件路径：{args.img_file}")
    print(f"输出文件路径：{args.out_file}")

    # 执行添加文本的操作
    add_text_to_image(args.img_file, args.out_file, "ricebean")

if __name__ == "__main__":
    main()
