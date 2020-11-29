package main

import (
	"fmt"
	"os"
	"path"
	"strings"

	"github.com/JoshVarga/svgparser"
	"github.com/evanw/esbuild/pkg/api"
)

func svgToJsx(items []*svgparser.Element) string {
	res := ""
	for _, el := range items {
		str := fmt.Sprintf("<%s %s>%s</%s>", el.Name, attributesToString(el.Attributes), svgToJsx(el.Children), el.Name)
		res += str
	}
	return res
}

func attributesToString(attr map[string]string) string {
	res := ""
	for key, val := range attr {
		str := fmt.Sprintf(`%s="%s"`, key, val)
		res += str
	}
	return res
}

func main() {

	var exampleOnResolvePlugin = api.Plugin{
		Name: "svg-loader",
		Setup: func(build api.PluginBuild) {
			build.OnResolve(api.OnResolveOptions{Filter: "^svgr:"}, func(args api.OnResolveArgs) (res api.OnResolveResult, err error) {
				res.Path = path.Join(path.Dir(args.Importer), strings.TrimLeft(args.Path, "svgr:"))
				res.Namespace = "svg"
				return res, nil
			})
			build.OnLoad(api.OnLoadOptions{Filter: `\.svg$`}, func(a api.OnLoadArgs) (res api.OnLoadResult, err error) {
				f, err := os.Open(a.Path)
				if err != nil {
					return res, err
				}
				svg, err := svgparser.Parse(f, true)
				if err != nil {
					return res, err
				}
				var contents = fmt.Sprintf(
					`import React from "react";
						import url from "%s";
						export default url;
						export function ReactComponent(props) {
							return (<svg %s {...props}>
        %s
        </svg>);
						}`, a.Path, attributesToString(svg.Attributes), svgToJsx(svg.Children))
				res.Contents = &contents
				res.Loader = api.LoaderTSX
				res.ResolveDir = path.Dir(a.Path)
				return res, nil
			})

		},
	}
	_ = exampleOnResolvePlugin
	result := api.Build(api.BuildOptions{
		EntryPoints: []string{"src/index.tsx"},
		Loader: map[string]api.Loader{
			".png":  api.LoaderDataURL,
			".woff": api.LoaderFile,
			".ttf":  api.LoaderFile,
		},
		External: []string{
			"worker-loader!../workers/evaluation.worker",
			"@blueprintjs",
			"../../resources/icons/icons-16.eot?#iefix",
			"../../resources/icons/icons-20.eot?#iefix",
		},
		MinifyWhitespace:  true,
		MinifyIdentifiers: true,
		MinifySyntax:      true,
		Sourcemap:         api.SourceMapLinked,
		Plugins:           []api.Plugin{exampleOnResolvePlugin},
		Define: map[string]string{
			"process.env.NODE_ENV": `"development"`,
		},
		Bundle: true,
		Outdir: "./out",
		Write:  true,
	})

	if len(result.Errors) > 0 {

		for _, err := range result.Errors {
			fmt.Println(err.Text)
			//fmt.Println(err.Location)
		}
		os.Exit(1)
	}
	if len(result.Warnings) > 0 {

		for _, err := range result.Warnings {
			fmt.Println(err.Text)
			//fmt.Println(err.Location)
		}

	}
	// if len(result.OutputFiles) > 0 {
	// 	for _, fl := range result.OutputFiles {
	// 		fmt.Println(fl.Path)
	// 		f, err := os.Create(fl.Path)
	// 		if err != nil {
	// 			fmt.Println(err)
	// 			return
	// 		}
	// 		f.Write(fl.Contents)
	// 	}
	// }
}
