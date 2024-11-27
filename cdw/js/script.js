// 用于标记图片上传与处理进行到哪步
const State = {btn: 'select'};
const state_handler = {
    set: function(target,key,value)
    {
        document.getElementById('select').style.display = 'none';
        document.getElementById('reset').style.display = 'none';
        document.getElementById('detect').style.display = 'none';
        document.getElementById('ana').style.display = 'none';
        document.getElementById('auto_annotation').style.display = 'none';
        document.getElementById('count').style.display = 'none';
        if(value!='finish')
            document.getElementById(value).style.display = 'inline-block';
        if(value!='select')
            document.getElementById('reset').style.display = 'inline-block';
        target[key]=value;
    }
}
const state = new Proxy(State, state_handler);

// 用于状态转移
const stateMove = {
    select: 'detect',
    detect: 'ana',
    ana: 'auto_annotation',
    auto_annotation: 'count',
    count: 'finish'
};
// 用于状态回调
const stateBack = {
    detect: 'select',
    ana: 'detect',
    auto_annotation: 'ana',
    count: 'auto_annotation',
    finish: 'count'
};

// 用于处理不同界面/元素的显示
const Display = {
    features: 1,
    upload: 0,
    about: 0,
    isSelected: 0,
    errorMessage: 0,
};
const display_handler = {
    set: function(target, key, value)
    {
        if(value === 1)
            document.getElementById(key).classList.add('active');
        else
            document.getElementById(key).classList.remove('active');
        target[key]=value;
    }
}
const display = new Proxy(Display, display_handler);

// 初始化
window.onload = function()
{
    state.btn='select';
    uploadListener();
    btnListener();
}

// 切换界面
function showSection(f,u,a)
{
    display['features']=f;
    display['upload']=u;
    display['about']=a;
}

// 上传图像
function uploadImage()
{
    document.getElementById('imageUpload').click();
}

// 重新上传
function resetImage()
{
    document.getElementById('errorMessage').textContent = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('imageUpload').value = '';
    display['isSelected']=0;
    display['errorMessage']=0;
    state.btn='select';
    uploadListener();
    btnListener();
}

// 判断上传情况
function Upload()
{
    if (document.getElementById('imageUpload').files[0])
    {
        display['isSelected']=1;
        display['errorMessage']=0;
        state.btn=stateMove[state.btn];
        btnListener();
    }
}

// 监听图片上传
function uploadListener()
{
    const Form = document.getElementById('imageUpload');
    Form.removeEventListener('change', Upload);
    Form.addEventListener('change', Upload);
}

// 进行detect
function Btn()
{
    const form = document.getElementById('uploadForm');
    const errorMessage = document.getElementById('errorMessage');
    const resultContainer = document.getElementById('result');
    display['isSelected']=0;
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024;
    display['errorMessage']=1;
    if (!file) // 检查文件存在
    {
        errorMessage.textContent = "请选择一张图片";
        state.btn=stateBack[state.btn];
        document.getElementById('imageUpload').value = '';
        return;
    }
    else if (!allowedTypes.includes(file.type)) // 检查文件类型
    {
        errorMessage.textContent = "只允许上传 JPG, JPEG, PNG 格式的图片";
        state.btn=stateBack[state.btn];
        document.getElementById('imageUpload').value = '';
        return;
    }
    else if (file.size > maxSize) // 检查文件大小
    {
        errorMessage.textContent = "文件大小不能超过 10MB";
        state.btn=stateBack[state.btn];
        document.getElementById('imageUpload').value = '';
        return;
    }
    else
        display['errorMessage']=0;
    const formData = new FormData(form);
    fetch('http://localhost/cdw/php/' + state.btn + '.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if(data.imgPath)
        {
            const img = document.createElement('img');
            img.src = 'http://localhost/cdw' + data.imgPath;
            img.style.width = '60vh' ;
            resultContainer.innerHTML='';
            resultContainer.appendChild(img);
            state.btn=stateMove[state.btn];
            if(state.btn!='finish')
                btnListener();
        }
    })
    .catch(error => {
        state.btn=stateBack[state.btn];
        document.getElementById('imageUpload').value = '';
        console.error('上传失败:', error);
        resultContainer.innerHTML = '<p>上传失败，请重试。</p>';
    });
}

// 监听按钮
function btnListener()
{
    if(state.btn=='select') return; // 如果是选择图片状态，则不执行
    const process = document.getElementById(state.btn);
    process.removeEventListener('click', Btn);
    process.addEventListener('click', Btn);
}