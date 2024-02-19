const td_template: &str = r#"
<div class="gallery-item">
    <h3>###name###[<a href="./###name###/index.html">+</a>][<a href="./###name###/###name###.txt">src</a>]</h3>
    <canvas id="canvas-###name###" width="320" height="180"></canvas>
    <script src="./###name###/main.js"></script>
</div>
"#;

fn main() {
    let fs_list = std::fs::read_dir("shaders/").unwrap();

    let gallery_template = include_str!("../templates/template_gallery.html");
    let individual_template = include_str!("../templates/template_individual.html");
    let main_js_template = include_str!("../templates/template_main.js");
    let vert_template = include_str!("../templates/template_vert.vert");

    let out_dir = "site/";
    std::fs::remove_dir_all(out_dir);
    std::fs::create_dir_all(out_dir);

    let mut tds = Vec::new();

    for entry in fs_list.map(|x| x.unwrap()) {
        let path = &entry.path();
        let filename = &entry.file_name().into_string().unwrap();
        let just_name = filename.split(".").nth(0).unwrap();
        let contents = std::fs::read_to_string(&path).unwrap();

        // dbg!(path, filename, contents);

        let mut out_path = out_dir.to_owned();
        out_path.push_str(just_name);
        out_path.push_str("/");

        // dbg!(&out_path);
        // let path = Path::new(&out_path);
        std::fs::create_dir_all(&out_path).unwrap();
        // std::fs::write(out_path, contents).unwrap();

        
        let index = individual_template.replace("###name###", just_name);
        std::fs::write(out_path.clone() + "index.html", index).unwrap();
        let mainjs = main_js_template.replace("###name###", just_name).replace("###fs###", &contents).replace("###vs###", vert_template);
        std::fs::write(out_path.clone() + "main.js", mainjs).unwrap();
        std::fs::write(out_path + just_name + ".txt", contents).unwrap();

        // goes main.js and index.html
        tds.push(td_template.replace("###name###", just_name));

    }

    let index = gallery_template.replace("###gallery###", &tds.join("\n"));
    std::fs::write(out_dir.to_owned() + "index.html", index).unwrap();
}
