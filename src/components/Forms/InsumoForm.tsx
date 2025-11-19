import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInsumo, updateInsumo } from "@/api/endpoints/insumos";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  unit: z.string().min(1, "Selecione uma unidade"),
  min_stock: z.string().min(1, "Informe a quantidade em estoque"),
  shelf_life_days: z.string().min(1, "Informe a data de validade"),
  is_perishable: z.string().optional(),
});

interface InsumoFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export function InsumoForm({ onSuccess, initialData }: InsumoFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          unit: initialData.unit,
          min_stock: initialData.min_stock.toString(),
          shelf_life_days: initialData.shelf_life_days ? initialData.shelf_life_days.toString() : "",
          is_perishable: initialData.is_perishable ? "yes" : "no",
        }
      : {
          name: "",
          unit: "",
          min_stock: "",
          shelf_life_days: "",
          is_perishable: "",
        },
  });
  const queryClient = useQueryClient();

  const mutationEdit = useMutation({
    mutationFn: updateInsumo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insumos"] });
      toast({
        title: "Insumo atualizado!",
        description: "O insumo foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar insumo",
        description: "Ocorreu um erro ao tentar atualizar o insumo.",
        variant: "destructive",
      });
    },
  });

  const mutation = useMutation({
    mutationFn: createInsumo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insumos"] });
      toast({
        title: "Insumo adicionado!",
        description: "O insumo foi adicionado com sucesso ao estoque.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao adicionar insumo",
        description: "Ocorreu um erro ao tentar adicionar o insumo.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedValues = {
      id: initialData?.id,
      name: values.name,
      unit: values.unit,
      min_stock: parseFloat(values.min_stock),
      shelf_life_days: parseFloat(values.shelf_life_days),
      is_perishable: values.is_perishable === "yes" ? true : false,
    };

    if (initialData) {
      mutationEdit.mutate(formattedValues);
    } else {
      mutation.mutate(formattedValues);
    }

    form.reset();
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Insumo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Tomate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="kg">Quilograma (kg)</SelectItem>
                    <SelectItem value="g">Grama (g)</SelectItem>
                    <SelectItem value="L">Litro (L)</SelectItem>
                    <SelectItem value="ml">Mililitro (ml)</SelectItem>
                    <SelectItem value="un">Unidade (un)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="min_stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade em Estoque</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="is_perishable"
            render={({ field }) => (
              <FormItem>
                <FormLabel>É perecível?</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="yes">Sim</SelectItem>
                      <SelectItem value="no">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shelf_life_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo de validade em dias</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" className="w-full bg-gradient-primary">
            {initialData ? "Salvar Alterações" : "Adicionar Insumo"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
